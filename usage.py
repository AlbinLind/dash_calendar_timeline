import datetime
from pprint import pp
import dash_calendar_timeline
import dash

app = dash.Dash()

app.layout = dash_calendar_timeline.DashCalendarTimeline(
    id="component",
    items=[
        {
            "id": 1,
            "title": "Round",
            "start_time": datetime.datetime(2025, 1, 1, 10, 30).timestamp() * 1000,
            "end_time": datetime.datetime(2025, 1, 2, 2, 28).timestamp() * 1000,
            "group": 0,
            "hoverInfo": "<b>Bold hover info</b><br>This is some hover info",
            "itemProps": {
                "style": {
                    "backgroundColor": "green",
                    "color": "white",
                }
            },
        },
        {
            "id": 2,
            "title": "Cleaning",
            "start_time": datetime.datetime(2025, 1, 2, 2, 28).timestamp() * 1000,
            "end_time": datetime.datetime(2025, 1, 2, 3, 57).timestamp() * 1000,
            "group": 0,
            "canMove": False,
        },
        {
            "id": 3,
            "title": "Square",
            "start_time": datetime.datetime(2025, 1, 2, 3, 57).timestamp() * 1000,
            "end_time": datetime.datetime(2025, 1, 2, 11, 42).timestamp() * 1000,
            "group": 0,
        },
    ],
    groups=[
        {"id": 0, "title": "Group 1", "rightTitle": "Right Title", "stackItems": True},
        {"id": 1, "title": "Group 2", "rightTitle": "Right Title", "stackItems": True},
    ],
)


@app.callback(
    dash.Output("component", "items"),
    dash.Input("component", "items"),
    prevent_initial_call=True,
)
def display_output(items):
    pp(items)
    return dash.no_update


@app.callback(
    dash.Output("component", "clickedItem"),
    dash.Input("component", "clickedItem"),
    prevent_initial_call=True,
)
def display_clicked_item(item):
    pp(item)
    return dash.no_update


@app.callback(
    dash.Output("component", "selectedItemInput"),
    dash.Input("component", "selectedItemInput"),
    prevent_initial_call=True,
)
def display_selected_item_input(selected_item_input):
    pp(selected_item_input)
    return dash.no_update


if __name__ == "__main__":
    app.run(debug=True)
