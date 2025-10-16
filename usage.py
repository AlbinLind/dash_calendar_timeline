import dash_calendar_timeline
import dash

app = dash.Dash()

app.layout = dash_calendar_timeline.DashCalendarTimeline(id="component")


if __name__ == "__main__":
    app.run(debug=True)
