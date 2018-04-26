CREATE MATERIALIZED VIEW hazards.{{ name }} AS
  SELECT
    event_id,
    calculation_method,
    frequency,
    occurrence_probability,
    st_collect(geom) AS geom,
    avg(average_footprint_intensity) AS average_event_intensity
  FROM (
    SELECT
      ev.id AS event_id,
      ev.calculation_method AS calculation_method,
      ev.frequency AS frequency,
      ev.occurrence_probability AS occurrence_probability,
      st_convexhull(st_collect(fpd.the_geom)) AS geom,
      avg(fpd.intensity) AS average_footprint_intensity
    FROM hazards.footprint_data AS fpd
      JOIN hazards.footprint AS fp ON (fpd.footprint_id = fp.id)
      JOIN hazards.footprint_set AS fps ON (fp.footprint_set_id = fps.id)
      JOIN hazards.event AS ev ON (fps.event_id = ev.id)
      JOIN hazards.event_set AS evs ON (ev.event_set_id = evs.id)
    WHERE fpd.footprint_id IN (
      SELECT fp.id AS footprint
      FROM hazards.footprint AS fp
      WHERE fp.footprint_set_id IN (
        SELECT fps.id AS footprint_set
        FROM hazards.footprint_set AS fps
        WHERE fps.event_id IN (
          SELECT id AS event
          FROM hazards.event
          WHERE event_set_id = {{ event_set_id }}
        )
      )
    )
    GROUP BY
      fp.id,
      ev.id,
      ev.calculation_method,
      ev.frequency,
      ev.occurrence_probability
  ) AS s
  GROUP BY
    event_id,
    calculation_method,
    frequency,
    occurrence_probability
WITH NO DATA