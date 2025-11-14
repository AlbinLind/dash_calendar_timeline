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

        - sku (number; optional):
            SKU number for the item.

        - is_fixed (boolean; optional):
            Is the item fixed in position.

        - legend (string; optional)

        - inputs (dict with strings as keys and values of type dict with strings as keys and values of type boolean | number | string | dict | list; optional):
            If you want some input fields to be shown for the item, you
            can specify them here.  When the input field changes it will
            update the `selectedItemInput` prop with the new values. Which
            can be used in a callback to update the item data.

    - context_menu_options (list of strings; optional):
        Options to show in the right click context menu.

    - default_time_end (number; optional):
        Default end time for the timeline.

    - default_time_start (number; optional):
        Default start time for the timeline.

    - deselected_legend_items (list of strings; optional):
        Legend items that are not selected.

    - drag_snap (number; optional):
        Snap dragged items to a time interval (in milliseconds).

    - enable_external_drop (boolean; optional)

    - enable_week_headers (boolean; optional):
        Enable week headers when zoomed between 1 and 2 weeks visible.
        Defaults to False.

    - externalDrop (dict; optional)

        `externalDrop` is a dict with keys:

        - data (boolean | number | string | dict | list; required)

        - time (number; required)

        - groupId (string | number; required)

    - groups (list of dicts; required)

        `groups` is a list of dicts with keys:

        - id (string | number; required)

        - title (string; required)

        - rightTitle (string; required)

        - stackItems (boolean; optional)

        - height (number; optional)

    - isFixedChanged (boolean; optional):
        Is fixed value of the item that was changed for the selected item.

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

        - sku (number; optional):
            SKU number for the item.

        - is_fixed (boolean; optional):
            Is the item fixed in position.

        - legend (string; optional)

        - inputs (dict with strings as keys and values of type dict with strings as keys and values of type boolean | number | string | dict | list; optional):
            If you want some input fields to be shown for the item, you
            can specify them here.  When the input field changes it will
            update the `selectedItemInput` prop with the new values. Which
            can be used in a callback to update the item data.

    - line_height (number; optional)

    - locale (a value equal to: 'en', 'de', 'sv', 'nl'; optional):
        dayjs locale to use for date formatting. Defaults to 'en'.
        Examples: 'en', 'fr', 'es', 'de', etc.

    - max_zoom (number; optional)

    - min_zoom (number; optional)

    - rightClickedEvent (dict; optional)

        `rightClickedEvent` is a dict with keys:

        - time (number; required):
            The time (in milliseconds since epoch) where the right click
            happened.

        - group_id (string | number; required):
            The group id where the right click happened.

        - option (string; required):
            The option that was clicked, defined in the context menu.

    - selectedItemInput (dict with strings as keys and values of type boolean | number | string | dict | list; optional)

    - skuChanged (number; optional):
        SKU number of the item that was changed for the selected item.

    - top_left_sidebar_content (a list of or a singular dash component, string or number; optional)

    - use_resize_handle (boolean; optional):
        Should you only be able to resize from the ends? Defaults to True.

    - visible_time_end (number; optional)

    - visible_time_start (number; optional)

    - week_header_max_days (number; optional):
        Maximum number of days visible to show week headers. Defaults to
        21 (3 weeks)."""

    _children_props = ["top_left_sidebar_content"]
    _base_nodes = ["top_left_sidebar_content", "children"]
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
            "sku": NotRequired[NumberType],
            "is_fixed": NotRequired[bool],
            "legend": NotRequired[str],
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
            "sku": NotRequired[NumberType],
            "is_fixed": NotRequired[bool],
            "legend": NotRequired[str],
            "inputs": NotRequired[
                typing.Dict[
                    typing.Union[str, float, int],
                    typing.Dict[typing.Union[str, float, int], typing.Any],
                ]
            ],
        },
    )

    RightClickedEvent = TypedDict(
        "RightClickedEvent",
        {"time": NumberType, "group_id": typing.Union[str, NumberType], "option": str},
    )

    ExternalDrop = TypedDict(
        "ExternalDrop",
        {
            "data": typing.Any,
            "time": NumberType,
            "groupId": typing.Union[str, NumberType],
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
        context_menu_options: typing.Optional[typing.Sequence[str]] = None,
        visible_time_start: typing.Optional[NumberType] = None,
        visible_time_end: typing.Optional[NumberType] = None,
        enable_external_drop: typing.Optional[bool] = None,
        enable_week_headers: typing.Optional[bool] = None,
        week_header_max_days: typing.Optional[NumberType] = None,
        deselected_legend_items: typing.Optional[typing.Sequence[str]] = None,
        top_left_sidebar_content: typing.Optional[ComponentType] = None,
        locale: typing.Optional[Literal["en", "de", "sv", "nl"]] = None,
        use_resize_handle: typing.Optional[bool] = None,
        clickedItem: typing.Optional["ClickedItem"] = None,
        selectedItemInput: typing.Optional[
            typing.Dict[typing.Union[str, float, int], typing.Any]
        ] = None,
        rightClickedEvent: typing.Optional["RightClickedEvent"] = None,
        skuChanged: typing.Optional[NumberType] = None,
        isFixedChanged: typing.Optional[bool] = None,
        externalDrop: typing.Optional["ExternalDrop"] = None,
        id: typing.Optional[typing.Union[str, dict]] = None,
        **kwargs,
    ):
        self._prop_names = [
            "id",
            "clickedItem",
            "context_menu_options",
            "default_time_end",
            "default_time_start",
            "deselected_legend_items",
            "drag_snap",
            "enable_external_drop",
            "enable_week_headers",
            "externalDrop",
            "groups",
            "isFixedChanged",
            "item_height_ratio",
            "items",
            "line_height",
            "locale",
            "max_zoom",
            "min_zoom",
            "rightClickedEvent",
            "selectedItemInput",
            "skuChanged",
            "top_left_sidebar_content",
            "use_resize_handle",
            "visible_time_end",
            "visible_time_start",
            "week_header_max_days",
        ]
        self._valid_wildcard_attributes = []
        self.available_properties = [
            "id",
            "clickedItem",
            "context_menu_options",
            "default_time_end",
            "default_time_start",
            "deselected_legend_items",
            "drag_snap",
            "enable_external_drop",
            "enable_week_headers",
            "externalDrop",
            "groups",
            "isFixedChanged",
            "item_height_ratio",
            "items",
            "line_height",
            "locale",
            "max_zoom",
            "min_zoom",
            "rightClickedEvent",
            "selectedItemInput",
            "skuChanged",
            "top_left_sidebar_content",
            "use_resize_handle",
            "visible_time_end",
            "visible_time_start",
            "week_header_max_days",
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
