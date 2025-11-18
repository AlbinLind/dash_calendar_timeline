import datetime
from pprint import pp
import dash_calendar_timeline
import dash

app = dash.Dash()

app.layout = dash.html.Div(
    children=[
        dash_calendar_timeline.DashCalendarTimeline(
            id="component",
            locale="nl",
            default_time_start=datetime.datetime(2025, 1, 1, 12, 0).timestamp() * 1000,
            default_time_end=datetime.datetime(2025, 1, 4, 0, 0).timestamp() * 1000,
            enable_week_headers=True,  # Enable week headers when zoomed to 1-2 weeks visible
            deselected_legend_items=[
                "Test Legend"
            ],  # Example of deselecting a legend item
            items=[
                {
                    "id": 1,
                    "title": "Round",
                    "start_time": datetime.datetime(2025, 1, 1, 10, 30).timestamp()
                    * 1000,
                    "end_time": datetime.datetime(2025, 1, 2, 2, 28).timestamp() * 1000,
                    "group": 0,
                    "hoverInfo": "<b>Bold hover info</b><br>This is some hover info",
                    "itemProps": {
                        "style": {
                            "background": "green",
                            "color": "white",
                        }
                    },
                },
                {
                    "id": 2,
                    "title": "Cleaning",
                    "start_time": datetime.datetime(2025, 1, 2, 2, 28).timestamp()
                    * 1000,
                    "end_time": datetime.datetime(2025, 1, 2, 3, 57).timestamp() * 1000,
                    "group": 0,
                    "canMove": False,
                },
                {
                    "id": 3,
                    "title": "Square",
                    "start_time": datetime.datetime(2025, 1, 2, 3, 57).timestamp()
                    * 1000,
                    "end_time": datetime.datetime(2025, 1, 2, 11, 42).timestamp()
                    * 1000,
                    "group": 0,
                },
            ],
            groups=[
                {
                    "id": 0,
                    "title": "Group 1",
                    "rightTitle": "Right Title",
                    "stackItems": True,
                },
                {
                    "id": 1,
                    "title": "Group 2",
                    "rightTitle": "Right Title",
                    "stackItems": True,
                },
            ],
            context_menu_options=["Option 1", "Option 2", "Option 3"],
            top_left_sidebar_content=dash.html.Div("Custom Sidebar Header Content"),
        ),
        dash.html.Button(
            "Reset Time", id="reset-time-button"
        ),  # Dummy button to have an extra Input
    ]
)


@app.callback(
    dash.Output("component", "items", allow_duplicate=True),
    dash.Input("component", "items"),
    prevent_initial_call=True,
)
def display_output(items):
    pp(items)
    return dash.no_update


@app.callback(
    dash.Output("component", "selectedItemInput"),
    dash.Input("component", "selectedItemInput"),
    prevent_initial_call=True,
)
def display_selected_item_input(selected_item_input):
    pp(selected_item_input)
    return dash.no_update


@app.callback(
    dash.Output("component", "items", allow_duplicate=True),
    dash.Input("component", "rightClickedEvent"),
    prevent_initial_call=True,
)
def update_on_right_click(event):
    print("Right clicked event:")
    pp(event)
    return dash.no_update


@app.callback(
    dash.Output("component", "items", allow_duplicate=True),
    dash.Input("component", "clickedItem"),
    prevent_initial_call=True,
)
def update_on_click(item):
    if item is None:
        return dash.no_update
    print("Clicked item:", item)
    return dash.no_update
    return [
        {
            "id": 4,
            "title": "Test 1",
            "start_time": datetime.datetime(2025, 1, 2, 4, 28).timestamp() * 1000,
            "end_time": datetime.datetime(2025, 1, 2, 7, 57).timestamp() * 1000,
            "group": 0,
            "canMove": False,
            "sku": 8,
            "is_fixed": True,
        },
        {
            "id": 5,
            "title": "Test 2",
            "start_time": datetime.datetime(2025, 1, 2, 10, 57).timestamp() * 1000,
            "end_time": datetime.datetime(2025, 1, 2, 19, 42).timestamp() * 1000,
            "group": 0,
            "sku": 12,
            "is_fixed": False,
        },
    ]


# NOTE: The callback as input for visible_time_start and visible_time_end is "stupid"
# this means that we can only use it as an output, it will by itself not trigger any updates
# when changing. Once you have set it as an output it will return None until you set it again,
# at which point it will be None again once it has been processed.
@app.callback(
    dash.Output("component", "visible_time_start"),
    dash.Output("component", "visible_time_end"),
    dash.Input("reset-time-button", "n_clicks"),
    prevent_initial_call=True,
)
def update_on_time_change(n_clicks):
    if n_clicks is None:
        return dash.no_update, dash.no_update

    # Update the visible time range based on the button click
    return datetime.datetime(2024, 12, 31, 0, 0).timestamp() * 1000, datetime.datetime(
        2025, 1, 4, 0, 0
    ).timestamp() * 1000


@app.callback(
    dash.Output("reset-time-button", "n_clicks", allow_duplicate=True),
    dash.Input("component", "skuChanged"),
    dash.Input("component", "isFixedChanged"),
    prevent_initial_call=True,
)
def log_item_changes(sku_changed, is_fixed_changed):
    print("SKU changed to:", sku_changed)
    print("Is fixed changed to:", is_fixed_changed)
    return dash.no_update


@app.callback(
    dash.Output("reset-time-button", "n_clicks", allow_duplicate=True),
    dash.Input("component", "rightClickedItem"),
    prevent_initial_call=True,
)
def log_right_clicked_item(right_clicked_item):
    print("Right clicked item:", right_clicked_item)
    return dash.no_update


if __name__ == "__main__":
    app.run(debug=True, port=8124)
