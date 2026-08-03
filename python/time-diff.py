from datetime import datetime 

timestamps = """2026-06-18 04:08:08
2026-06-18 04:08:12
2026-06-18 04:08:12
2026-06-18 04:08:12
2026-06-18 06:06:22
2026-06-18 06:06:32
2026-06-18 08:06:22
2026-06-18 08:06:22
2026-06-18 08:06:32
2026-06-18 08:10:08
2026-06-18 08:10:08
2026-06-18 08:10:09
2026-06-18 08:10:09"""

# print(timestamps.split("\n"))
dt_list = [datetime.strptime(ts, "%Y-%m-%d %H:%M:%S") for ts in timestamps.split("\n")]
min_dt = min(dt_list)
max_dt = max(dt_list)
total_duration = max_dt - min_dt

print(f"Start time: {min_dt}")
print(f"End time: {max_dt}")
print(f"Total time (difference): {total_duration}")
print(f"Total seconds: {total_duration.total_seconds()}")
