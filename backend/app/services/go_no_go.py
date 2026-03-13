"""
The Go/No-Go Engine — the core brain of WeatherEdge.

Evaluates weather conditions against operation-specific thresholds
and returns GO / MARGINAL / NO-GO with parameter-level breakdown.
"""
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

from app.models.operations import DEFAULT_OPERATION_PROFILES


class Decision(str, Enum):
    GO = "GO"
    MARGINAL = "MARGINAL"
    NO_GO = "NO_GO"


@dataclass
class ParameterCheck:
    parameter: str
    label: str
    unit: str
    value: float | None
    limit: float | None
    margin_pct: float = 0.15  # 15% buffer zone for MARGINAL
    status: Decision = Decision.GO
    is_limiting: bool = False

    def evaluate(self) -> "ParameterCheck":
        if self.limit is None or self.value is None:
            self.status = Decision.GO
            return self

        if self.value > self.limit:
            self.status = Decision.NO_GO
            self.is_limiting = True
        elif self.value > self.limit * (1 - self.margin_pct):
            self.status = Decision.MARGINAL
        else:
            self.status = Decision.GO
        return self


@dataclass
class GoNoGoResult:
    operation_type: str
    operation_label: str
    forecast_time: datetime
    decision: Decision
    confidence_pct: float
    checks: list[ParameterCheck]
    limiting_factors: list[str]
    color: str

    def to_dict(self) -> dict:
        return {
            "operation_type": self.operation_type,
            "operation_label": self.operation_label,
            "forecast_time": self.forecast_time.isoformat(),
            "decision": self.decision.value,
            "confidence_pct": round(self.confidence_pct, 1),
            "color": self.color,
            "checks": [
                {
                    "parameter": c.parameter,
                    "label": c.label,
                    "unit": c.unit,
                    "value": round(c.value, 2) if c.value is not None else None,
                    "limit": c.limit,
                    "status": c.status.value,
                    "is_limiting": c.is_limiting,
                }
                for c in self.checks
            ],
            "limiting_factors": self.limiting_factors,
        }


PARAM_META = {
    "wave_height_m": {"label": "Wave Height (Hs)", "unit": "m"},
    "wave_period_s": {"label": "Wave Period (Tp)", "unit": "s"},
    "wind_speed_10m_ms": {"label": "Wind Speed (10m)", "unit": "m/s"},
    "wind_gusts_ms": {"label": "Wind Gusts", "unit": "m/s"},
    "visibility_m": {"label": "Visibility", "unit": "m"},
    "precipitation_mm": {"label": "Precipitation", "unit": "mm/hr"},
    "current_speed_ms": {"label": "Current Speed", "unit": "m/s"},
}

# Visibility is "higher is better" — invert logic
INVERTED_PARAMS = {"visibility_m"}


def evaluate_single_hour(
    operation_type: str,
    weather: dict,
    custom_limits: dict | None = None,
) -> GoNoGoResult:
    """
    Evaluate go/no-go for a single operation at a single forecast hour.

    weather: dict with keys like wave_height_m, wind_speed_10m_ms, etc.
    """
    profile = DEFAULT_OPERATION_PROFILES.get(operation_type)
    if not profile:
        raise ValueError(f"Unknown operation type: {operation_type}")

    limits = {**profile["limits"]}
    if custom_limits:
        limits.update({k: v for k, v in custom_limits.items() if v is not None})

    checks = []
    for param, limit in limits.items():
        if limit is None:
            continue

        value = weather.get(param)
        meta = PARAM_META.get(param, {"label": param, "unit": ""})

        if param in INVERTED_PARAMS:
            check = ParameterCheck(
                parameter=param,
                label=meta["label"],
                unit=meta["unit"],
                value=value,
                limit=limit,
            )
            if value is None:
                check.status = Decision.GO
            elif value < limit:
                check.status = Decision.NO_GO
                check.is_limiting = True
            elif value < limit * (1 + check.margin_pct):
                check.status = Decision.MARGINAL
            else:
                check.status = Decision.GO
        else:
            check = ParameterCheck(
                parameter=param,
                label=meta["label"],
                unit=meta["unit"],
                value=value,
                limit=limit,
            )
            check.evaluate()

        checks.append(check)

    has_no_go = any(c.status == Decision.NO_GO for c in checks)
    has_marginal = any(c.status == Decision.MARGINAL for c in checks)

    if has_no_go:
        decision = Decision.NO_GO
    elif has_marginal:
        decision = Decision.MARGINAL
    else:
        decision = Decision.GO

    # Simple confidence heuristic based on how far values are from limits
    confidence = _calc_confidence(checks, limits)

    limiting_factors = [c.label for c in checks if c.is_limiting]

    forecast_time = weather.get("forecast_time", datetime.now())
    if isinstance(forecast_time, str):
        forecast_time = datetime.fromisoformat(forecast_time)

    return GoNoGoResult(
        operation_type=operation_type,
        operation_label=profile["label"],
        forecast_time=forecast_time,
        decision=decision,
        confidence_pct=confidence,
        checks=checks,
        limiting_factors=limiting_factors,
        color=profile.get("color", "#6b7280"),
    )


def _calc_confidence(checks: list[ParameterCheck], limits: dict) -> float:
    """
    Heuristic confidence score:
    - 95%+ if all params well within limits
    - Decreases as params approach limits
    - Lower if data is missing
    """
    if not checks:
        return 50.0

    scores = []
    for check in checks:
        if check.value is None or check.limit is None:
            scores.append(0.7)
            continue

        if check.parameter in INVERTED_PARAMS:
            ratio = check.value / check.limit if check.limit > 0 else 1.0
            ratio = min(ratio, 2.0)
        else:
            ratio = check.limit / check.value if check.value > 0 else 2.0
            ratio = min(ratio, 2.0)

        if ratio >= 1.5:
            scores.append(1.0)
        elif ratio >= 1.0:
            scores.append(0.5 + (ratio - 1.0))
        else:
            scores.append(max(0.0, ratio * 0.5))

    avg = sum(scores) / len(scores)
    return round(avg * 100, 1)


def evaluate_forecast_series(
    operation_type: str,
    forecast_rows: list[dict],
    custom_limits: dict | None = None,
) -> list[GoNoGoResult]:
    """Evaluate go/no-go across a time series of forecast data."""
    return [
        evaluate_single_hour(operation_type, row, custom_limits)
        for row in forecast_rows
    ]
