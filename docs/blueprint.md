# **App Name**: ShiftMaster Rota

## Core Features:

- Automated Shift Scheduling: Automated weekly shift rota generation based on predefined sequence: Evening, Evening, Night, Night, Weekly Off, General, Morning, Morning. If a general shift falls on a Sunday, it automatically gets replaced with a second weekly off. The LLM acts as a tool that might need to refer to the current day and date to ensure accuracy and will be programmed to generate accordingly. Reasoning with current Date & Time is delegated to LLM Tool.
- Calendar View: Calendar-based view displaying dates and corresponding shifts.
- Shift Display: Clear and concise display of shifts (Morning, Evening, Night, Weekly Off, General Shift) for each date.
- Weekly Off Indicator: A simple indicator (e.g., color-coding) for Weekly Off days on the calendar.

## Style Guidelines:

- Primary color: Dark blue (#3F51B5) to evoke trust and organization.
- Background color: Light gray (#F5F5F5) for a clean, readable interface.
- Accent color: Teal (#009688) to highlight important actions or indicators.
- Font: 'Inter' sans-serif for a modern and readable interface.
- Simple, clear icons to represent different shift types. (e.g., sun for morning, moon for night)
- Clean and organized calendar layout for easy navigation and information retrieval.