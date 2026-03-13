"""
Daily Briefing Generator — produces the morning operations briefing
that marine coordinators use in their 06:00 planning call.
"""
from datetime import datetime, timedelta, timezone

from app.models.operations import DEFAULT_OPERATION_PROFILES
from app.services.go_no_go import evaluate_single_hour, Decision
from app.services.window_finder import find_windows


def generate_briefing(
    site_name: str,
    forecast_rows: list[dict],
    operation_types: list[str] | None = None,
    target_date: datetime | None = None,
) -> dict:
    """
    Generate a daily briefing for a site covering:
    - Today's conditions and go/no-go per operation
    - Tomorrow's outlook
    - 7-day summary
    - Best upcoming windows
    """
    if target_date is None:
        target_date = datetime.now(timezone.utc)

    today_start = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    tomorrow_start = today_end
    tomorrow_end = tomorrow_start + timedelta(days=1)

    if operation_types is None:
        operation_types = list(DEFAULT_OPERATION_PROFILES.keys())

    today_rows = [r for r in forecast_rows if _in_range(r, today_start, today_end)]
    tomorrow_rows = [r for r in forecast_rows if _in_range(r, tomorrow_start, tomorrow_end)]
    work_hours_today = [r for r in today_rows if _in_work_hours(r, 6, 18)]
    work_hours_tomorrow = [r for r in tomorrow_rows if _in_work_hours(r, 6, 18)]

    ops_today = {}
    ops_tomorrow = {}
    windows_next_7_days = {}

    for op_type in operation_types:
        profile = DEFAULT_OPERATION_PROFILES.get(op_type, {})

        # Today's assessment
        if work_hours_today:
            results = [evaluate_single_hour(op_type, r) for r in work_hours_today]
            go_count = sum(1 for r in results if r.decision == Decision.GO)
            marginal_count = sum(1 for r in results if r.decision == Decision.MARGINAL)
            no_go_count = sum(1 for r in results if r.decision == Decision.NO_GO)
            total = len(results)

            if go_count == total:
                overall = "GO"
            elif no_go_count == total:
                overall = "NO_GO"
            elif go_count > no_go_count:
                overall = "PARTIAL_GO"
            elif marginal_count > 0 and no_go_count == 0:
                overall = "MARGINAL"
            else:
                overall = "NO_GO"

            # Find the best contiguous window today
            go_start = None
            go_end = None
            for r in results:
                if r.decision in (Decision.GO, Decision.MARGINAL):
                    if go_start is None:
                        go_start = r.forecast_time
                    go_end = r.forecast_time + timedelta(hours=1)
                else:
                    break

            avg_conf = sum(r.confidence_pct for r in results) / total if total else 0

            # Find the most common limiting factor
            all_limiters = []
            for r in results:
                all_limiters.extend(r.limiting_factors)
            top_limiter = max(set(all_limiters), key=all_limiters.count) if all_limiters else None

            ops_today[op_type] = {
                "label": profile.get("label", op_type),
                "color": profile.get("color", "#6b7280"),
                "overall": overall,
                "go_hours": go_count,
                "marginal_hours": marginal_count,
                "no_go_hours": no_go_count,
                "total_hours": total,
                "avg_confidence": round(avg_conf, 1),
                "window_start": go_start.isoformat() if go_start else None,
                "window_end": go_end.isoformat() if go_end else None,
                "limiting_factor": top_limiter,
            }
        else:
            ops_today[op_type] = {
                "label": profile.get("label", op_type),
                "color": profile.get("color", "#6b7280"),
                "overall": "NO_DATA",
                "go_hours": 0, "marginal_hours": 0, "no_go_hours": 0,
                "total_hours": 0, "avg_confidence": 0,
                "window_start": None, "window_end": None,
                "limiting_factor": None,
            }

        # Tomorrow's outlook (same logic, simpler)
        if work_hours_tomorrow:
            results = [evaluate_single_hour(op_type, r) for r in work_hours_tomorrow]
            go_count = sum(1 for r in results if r.decision == Decision.GO)
            total = len(results)
            avg_conf = sum(r.confidence_pct for r in results) / total if total else 0
            ops_tomorrow[op_type] = {
                "label": profile.get("label", op_type),
                "go_hours": go_count,
                "total_hours": total,
                "avg_confidence": round(avg_conf, 1),
                "outlook": "Good" if go_count >= total * 0.8 else ("Mixed" if go_count > 0 else "Poor"),
            }
        else:
            ops_tomorrow[op_type] = {
                "label": profile.get("label", op_type),
                "go_hours": 0, "total_hours": 0, "avg_confidence": 0,
                "outlook": "No data",
            }

        # Next 7 days — best windows
        seven_day_end = today_start + timedelta(days=7)
        seven_day_rows = [r for r in forecast_rows if _in_range(r, today_start, seven_day_end)]
        windows = find_windows(
            op_type, seven_day_rows,
            min_duration_hours=profile.get("min_window_hours", 4),
        )
        windows_next_7_days[op_type] = [w.to_dict() for w in windows[:5]]

    # Current conditions snapshot
    current = _get_current_conditions(forecast_rows, target_date)

    # 7-day daily summary
    daily_summary = _build_daily_summary(forecast_rows, today_start, operation_types)

    return {
        "site_name": site_name,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "target_date": target_date.isoformat(),
        "current_conditions": current,
        "today": ops_today,
        "tomorrow": ops_tomorrow,
        "windows_next_7_days": windows_next_7_days,
        "daily_summary": daily_summary,
    }


def _in_range(row: dict, start: datetime, end: datetime) -> bool:
    ft = row.get("forecast_time")
    if isinstance(ft, str):
        ft = datetime.fromisoformat(ft)
    if ft is None:
        return False
    if ft.tzinfo is None:
        ft = ft.replace(tzinfo=timezone.utc)
    s = start if start.tzinfo else start.replace(tzinfo=timezone.utc)
    e = end if end.tzinfo else end.replace(tzinfo=timezone.utc)
    return s <= ft < e


def _in_work_hours(row: dict, start_hour: int, end_hour: int) -> bool:
    ft = row.get("forecast_time")
    if isinstance(ft, str):
        ft = datetime.fromisoformat(ft)
    if ft is None:
        return False
    return start_hour <= ft.hour < end_hour


def _get_current_conditions(forecast_rows: list[dict], target_time: datetime) -> dict:
    """Find the forecast row closest to the target time."""
    if not forecast_rows:
        return {}

    best = None
    best_diff = float("inf")
    for row in forecast_rows:
        ft = row.get("forecast_time")
        if isinstance(ft, str):
            ft = datetime.fromisoformat(ft)
        if ft is None:
            continue
        if ft.tzinfo is None:
            ft = ft.replace(tzinfo=timezone.utc)
        tt = target_time if target_time.tzinfo else target_time.replace(tzinfo=timezone.utc)
        diff = abs((ft - tt).total_seconds())
        if diff < best_diff:
            best_diff = diff
            best = row

    if best is None:
        return {}

    return {
        "time": best.get("forecast_time").isoformat() if isinstance(best.get("forecast_time"), datetime) else best.get("forecast_time"),
        "wave_height_m": best.get("wave_height_m"),
        "wave_period_s": best.get("wave_period_s"),
        "wind_speed_10m_ms": best.get("wind_speed_10m_ms"),
        "wind_speed_80m_ms": best.get("wind_speed_80m_ms"),
        "wind_gusts_ms": best.get("wind_gusts_ms"),
        "visibility_m": best.get("visibility_m"),
        "precipitation_mm": best.get("precipitation_mm"),
        "temperature_c": best.get("temperature_c"),
    }


def _build_daily_summary(
    forecast_rows: list[dict],
    start_date: datetime,
    operation_types: list[str],
) -> list[dict]:
    """Build a 7-day summary with daily operation assessments."""
    summary = []
    for day_offset in range(7):
        day_start = start_date + timedelta(days=day_offset)
        day_end = day_start + timedelta(days=1)
        day_rows = [r for r in forecast_rows if _in_range(r, day_start, day_end)]
        work_rows = [r for r in day_rows if _in_work_hours(r, 6, 18)]

        day_ops = {}
        for op_type in operation_types:
            if work_rows:
                results = [evaluate_single_hour(op_type, r) for r in work_rows]
                go = sum(1 for r in results if r.decision == Decision.GO)
                total = len(results)
                day_ops[op_type] = {
                    "go_hours": go,
                    "total_hours": total,
                    "rating": "good" if go >= total * 0.8 else ("mixed" if go > 0 else "poor"),
                }
            else:
                day_ops[op_type] = {"go_hours": 0, "total_hours": 0, "rating": "no_data"}

        avg_hs = None
        avg_ws = None
        if day_rows:
            hs_vals = [r.get("wave_height_m") for r in day_rows if r.get("wave_height_m") is not None]
            ws_vals = [r.get("wind_speed_10m_ms") for r in day_rows if r.get("wind_speed_10m_ms") is not None]
            avg_hs = round(sum(hs_vals) / len(hs_vals), 1) if hs_vals else None
            avg_ws = round(sum(ws_vals) / len(ws_vals), 1) if ws_vals else None

        summary.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "day_name": day_start.strftime("%A"),
            "avg_wave_height_m": avg_hs,
            "avg_wind_speed_ms": avg_ws,
            "operations": day_ops,
        })

    return summary
