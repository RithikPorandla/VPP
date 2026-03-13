"""
Weather Window Finder — identifies workable weather windows
for a given operation type across the forecast period.
"""
from dataclasses import dataclass, field
from datetime import datetime, timedelta

from app.services.go_no_go import evaluate_single_hour, Decision


@dataclass
class WeatherWindow:
    start: datetime
    end: datetime
    duration_hours: float
    avg_confidence: float
    min_confidence: float
    has_marginal_periods: bool
    marginal_hours: int
    go_hours: int
    risk_level: str  # Low, Medium, High

    def to_dict(self) -> dict:
        return {
            "start": self.start.isoformat(),
            "end": self.end.isoformat(),
            "duration_hours": round(self.duration_hours, 1),
            "avg_confidence": round(self.avg_confidence, 1),
            "min_confidence": round(self.min_confidence, 1),
            "has_marginal_periods": self.has_marginal_periods,
            "marginal_hours": self.marginal_hours,
            "go_hours": self.go_hours,
            "risk_level": self.risk_level,
        }


def find_windows(
    operation_type: str,
    forecast_rows: list[dict],
    min_duration_hours: float = 4.0,
    custom_limits: dict | None = None,
    include_marginal: bool = True,
) -> list[WeatherWindow]:
    """
    Scan the forecast timeline and find consecutive windows where
    the operation is GO (or MARGINAL if include_marginal=True).
    """
    windows = []
    current_window_start = None
    current_confidences = []
    current_marginal = 0
    current_go = 0

    for row in forecast_rows:
        result = evaluate_single_hour(operation_type, row, custom_limits)

        is_workable = (
            result.decision == Decision.GO
            or (include_marginal and result.decision == Decision.MARGINAL)
        )

        if is_workable:
            if current_window_start is None:
                current_window_start = result.forecast_time
                current_confidences = []
                current_marginal = 0
                current_go = 0

            current_confidences.append(result.confidence_pct)
            if result.decision == Decision.MARGINAL:
                current_marginal += 1
            else:
                current_go += 1
        else:
            if current_window_start is not None:
                _maybe_add_window(
                    windows, current_window_start, result.forecast_time,
                    current_confidences, current_marginal, current_go,
                    min_duration_hours
                )
                current_window_start = None

    # Handle window that extends to end of forecast
    if current_window_start is not None and forecast_rows:
        last_time = forecast_rows[-1].get("forecast_time")
        if isinstance(last_time, str):
            last_time = datetime.fromisoformat(last_time)
        end_time = last_time + timedelta(hours=1) if last_time else current_window_start
        _maybe_add_window(
            windows, current_window_start, end_time,
            current_confidences, current_marginal, current_go,
            min_duration_hours
        )

    windows.sort(key=lambda w: (-w.avg_confidence, -w.duration_hours))
    return windows


def _maybe_add_window(
    windows: list,
    start: datetime,
    end: datetime,
    confidences: list[float],
    marginal: int,
    go: int,
    min_hours: float,
):
    if isinstance(start, str):
        start = datetime.fromisoformat(start)
    if isinstance(end, str):
        end = datetime.fromisoformat(end)

    duration = (end - start).total_seconds() / 3600
    if duration < min_hours:
        return

    avg_conf = sum(confidences) / len(confidences) if confidences else 0
    min_conf = min(confidences) if confidences else 0

    if avg_conf >= 80 and marginal == 0:
        risk = "Low"
    elif avg_conf >= 60:
        risk = "Medium"
    else:
        risk = "High"

    windows.append(WeatherWindow(
        start=start,
        end=end,
        duration_hours=round(duration, 1),
        avg_confidence=avg_conf,
        min_confidence=min_conf,
        has_marginal_periods=marginal > 0,
        marginal_hours=marginal,
        go_hours=go,
        risk_level=risk,
    ))


def find_campaign_windows(
    operation_type: str,
    forecast_rows: list[dict],
    required_days: int = 3,
    custom_limits: dict | None = None,
) -> list[dict]:
    """
    Find multi-day windows suitable for campaign operations
    (e.g., blade replacement, major component swaps).
    """
    required_hours = required_days * 10  # ~10 working hours per day
    windows = find_windows(
        operation_type, forecast_rows,
        min_duration_hours=required_hours,
        custom_limits=custom_limits,
        include_marginal=False,
    )

    results = []
    for w in windows:
        results.append({
            **w.to_dict(),
            "required_days": required_days,
            "covers_requirement": w.duration_hours >= required_hours,
            "buffer_hours": round(w.duration_hours - required_hours, 1),
        })

    return results
