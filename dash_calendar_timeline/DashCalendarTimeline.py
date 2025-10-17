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
        Unique ID to identify this component in Dash callbacks.

    - clickedItem (dict; optional):
        The item that was clicked, if any.

        `clickedItem` is a dict with keys:

        - id (string | number; required)

        - group (string | number; required)

        - title (string; required)

        - start_time (number; required):
            Unix timestamp in milliseconds.

        - end_time (number; required):
            Unix timestamp in milliseconds.

        - canMove (boolean; optional):
            Can the item be moved.

        - canResize (optional):
            Can the item be resized at all, and if so, can all or only one
            edge be resized?  You cannot disable resizing. This is becuase
            dash does not generate literal unions with primitive types
            well. See https://github.com/plotly/dash/issues/3017 \"both\":
            can be resized at both edges \"left\": can only be resized at
            the left edge \"right\": can only be resized at the right
            edge.

        - canChangeGroup (boolean; optional):
            Can the item be moved to a different group?.

        - itemProps (dict; optional)

            `itemProps` is a dict with keys:

            - className (string; optional)

            - style (dict with strings as keys and values of type boolean | number | string | dict | list; optional):
                Dict with CSS styles to apply to the item.

        - hoverInfo (string; optional):
            Hover information for the item, can be html to show.

        - inputs (dict with strings as keys and values of type dict with strings as keys and values of type boolean | number | string | dict | list; optional):
            If you want some input fields to be shown for the item, you
            can specify them here.  When the input field changes it will
            update the `selectedItemInput` prop with the new values. Which
            can be used in a callback to update the item data.

    - default_time_end (number; optional):
        Default end time for the timeline.

    - default_time_start (number; optional):
        Default start time for the timeline.

    - drag_snap (number; optional):
        Snap dragged items to a time interval (in milliseconds).

    - groups (list of dicts; required)

        `groups` is a list of dicts with keys:

        - id (string | number; required)

        - title (string; required)

        - rightTitle (string; required)

        - stackItems (boolean; optional)

        - height (number; optional)

    - item_height_ratio (number; optional)

    - items (list of dicts; required)

        `items` is a list of dicts with keys:

        - id (string | number; required)

        - group (string | number; required)

        - title (string; required)

        - start_time (number; required):
            Unix timestamp in milliseconds.

        - end_time (number; required):
            Unix timestamp in milliseconds.

        - canMove (boolean; optional):
            Can the item be moved.

        - canResize (optional):
            Can the item be resized at all, and if so, can all or only one
            edge be resized?  You cannot disable resizing. This is becuase
            dash does not generate literal unions with primitive types
            well. See https://github.com/plotly/dash/issues/3017 \"both\":
            can be resized at both edges \"left\": can only be resized at
            the left edge \"right\": can only be resized at the right
            edge.

        - canChangeGroup (boolean; optional):
            Can the item be moved to a different group?.

        - itemProps (dict; optional)

            `itemProps` is a dict with keys:

            - className (string; optional)

            - style (dict with strings as keys and values of type boolean | number | string | dict | list; optional):
                Dict with CSS styles to apply to the item.

        - hoverInfo (string; optional):
            Hover information for the item, can be html to show.

        - inputs (dict with strings as keys and values of type dict with strings as keys and values of type boolean | number | string | dict | list; optional):
            If you want some input fields to be shown for the item, you
            can specify them here.  When the input field changes it will
            update the `selectedItemInput` prop with the new values. Which
            can be used in a callback to update the item data.

    - line_height (number; optional)

    - max_zoom (number; optional)

    - min_zoom (number; optional)

    - selectedItemInput (dict with strings as keys and values of type boolean | number | string | dict | list; optional)

    - use_resize_handle (boolean; optional):
        Should you only be able to resize from the ends? Defaults to True."""

    _children_props = []
    _base_nodes = ["children"]
    _namespace = "dash_calendar_timeline"
    _type = "DashCalendarTimeline"
    ItemsItemProps = TypedDict(
        "ItemsItemProps",
        {
            "className": NotRequired[str],
            "style": NotRequired[
                typing.Dict[typing.Union[str, float, int], typing.Any]
            ],
        },
    )

    Items = TypedDict(
        "Items",
        {
            "id": typing.Union[str, NumberType],
            "group": typing.Union[str, NumberType],
            "title": str,
            "start_time": NumberType,
            "end_time": NumberType,
            "canMove": NotRequired[bool],
            "canResize": NotRequired[
                typing.Union[Literal["left"], Literal["right"], Literal["both"]]
            ],
            "canChangeGroup": NotRequired[bool],
            "itemProps": NotRequired["ItemsItemProps"],
            "hoverInfo": NotRequired[str],
            "inputs": NotRequired[
                typing.Dict[
                    typing.Union[str, float, int],
                    typing.Dict[typing.Union[str, float, int], typing.Any],
                ]
            ],
        },
    )

    Groups = TypedDict(
        "Groups",
        {
            "id": typing.Union[str, NumberType],
            "title": str,
            "rightTitle": str,
            "stackItems": NotRequired[bool],
            "height": NotRequired[NumberType],
        },
    )

    ClickedItemItemProps = TypedDict(
        "ClickedItemItemProps",
        {
            "className": NotRequired[str],
            "style": NotRequired[
                typing.Dict[typing.Union[str, float, int], typing.Any]
            ],
        },
    )

    ClickedItem = TypedDict(
        "ClickedItem",
        {
            "id": typing.Union[str, NumberType],
            "group": typing.Union[str, NumberType],
            "title": str,
            "start_time": NumberType,
            "end_time": NumberType,
            "canMove": NotRequired[bool],
            "canResize": NotRequired[
                typing.Union[Literal["left"], Literal["right"], Literal["both"]]
            ],
            "canChangeGroup": NotRequired[bool],
            "itemProps": NotRequired["ClickedItemItemProps"],
            "hoverInfo": NotRequired[str],
            "inputs": NotRequired[
                typing.Dict[
                    typing.Union[str, float, int],
                    typing.Dict[typing.Union[str, float, int], typing.Any],
                ]
            ],
        },
    )

    def __init__(
        self,
        items: typing.Optional[typing.Sequence["Items"]] = None,
        groups: typing.Optional[typing.Sequence["Groups"]] = None,
        default_time_start: typing.Optional[NumberType] = None,
        default_time_end: typing.Optional[NumberType] = None,
        drag_snap: typing.Optional[NumberType] = None,
        min_zoom: typing.Optional[NumberType] = None,
        max_zoom: typing.Optional[NumberType] = None,
        line_height: typing.Optional[NumberType] = None,
        item_height_ratio: typing.Optional[NumberType] = None,
        use_resize_handle: typing.Optional[bool] = None,
        clickedItem: typing.Optional["ClickedItem"] = None,
        selectedItemInput: typing.Optional[
            typing.Dict[typing.Union[str, float, int], typing.Any]
        ] = None,
        id: typing.Optional[typing.Union[str, dict]] = None,
        **kwargs,
    ):
        self._prop_names = [
            "id",
            "clickedItem",
            "default_time_end",
            "default_time_start",
            "drag_snap",
            "groups",
            "item_height_ratio",
            "items",
            "line_height",
            "max_zoom",
            "min_zoom",
            "selectedItemInput",
            "use_resize_handle",
        ]
        self._valid_wildcard_attributes = []
        self.available_properties = [
            "id",
            "clickedItem",
            "default_time_end",
            "default_time_start",
            "drag_snap",
            "groups",
            "item_height_ratio",
            "items",
            "line_height",
            "max_zoom",
            "min_zoom",
            "selectedItemInput",
            "use_resize_handle",
        ]
        self.available_wildcard_properties = []
        _explicit_args = kwargs.pop("_explicit_args")
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        for k in ["groups", "items"]:
            if k not in args:
                raise TypeError("Required argument `" + k + "` was not specified.")

        super(DashCalendarTimeline, self).__init__(**args)


setattr(
    DashCalendarTimeline, "__init__", _explicitize_args(DashCalendarTimeline.__init__)
)
