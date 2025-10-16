import dash_calendar_timeline
import dash

app = dash.Dash()

app.layout = dash_calendar_timeline.DashCalendarTimeline(
    id="component",
    items=[{"id": 1, "title": "Albin", "start_time": 1, "end_time": 200, "group": 0}],
    groups=[{"id": 0, "title": "Group 1", "rightTitle": "Right Title"}],
)


if __name__ == "__main__":
    app.run(debug=True)
