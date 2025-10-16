# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal  # noqa: F401
from dash.development.base_component import Component, _explicitize_args

ComponentType = typing.Union[
    str,
    int,
    float,
    Component,
    None,
    typing.Sequence[typing.Union[str, int, float, Component, None]],
]

NumberType = typing.Union[
    typing.SupportsFloat, typing.SupportsInt, typing.SupportsComplex
]


class DashCalendarTimeline(Component):
    """A DashCalendarTimeline component.
    Component description

    Keyword arguments:

    - id (string; optional):
        Unique ID to identify this component in Dash callbacks."""

    _children_props = []
    _base_nodes = ["children"]
    _namespace = "dash_calendar_timeline"
    _type = "DashCalendarTimeline"

    def __init__(self, id: typing.Optional[typing.Union[str, dict]] = None, **kwargs):
        self._prop_names = ["id"]
        self._valid_wildcard_attributes = []
        self.available_properties = ["id"]
        self.available_wildcard_properties = []
        _explicit_args = kwargs.pop("_explicit_args")
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(DashCalendarTimeline, self).__init__(**args)


setattr(
    DashCalendarTimeline, "__init__", _explicitize_args(DashCalendarTimeline.__init__)
)
