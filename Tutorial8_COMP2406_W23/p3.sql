create table playlist_tracks (
user text not null,
playlist_name text not null,
recording_id integer not null references recordings(recording_id),
primary key (user,playlist_name,recording_id) );