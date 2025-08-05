select user,playlist_name,compositions.title
from
playlist_tracks join recordings on playlist_tracks.recording_id=recordings.recording_id
Join compositions on recordings.song_id=compositions.song_id

