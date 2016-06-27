!# /bin/sh

# Download layers from naturalearthdata.com: ne_10m_admin_0_map_subunits
wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_map_subunits.zip

unzip ne_10m_admin_0_map_subunits.zip

# Convert data to GeoJSON format
ogr2ogr \
  -f GeoJSON \
  -where "continent = 'North America'" \
  continentnorthamerica.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'South America'" \
  continentsouthamerica.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Europe'" \
  continenteurope.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Africa'" \
  continentafrica.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Asia'" \
  continentasia.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Oceania'" \
  continentoceania.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

# Convert to TopoJSON format
topojson \
  -o northamerica.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentnorthamerica.json

topojson \
  -o southamerica.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentsouthamerica.json

topojson \
  -o europe.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continenteurope.json

topojson \
  -o africa.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentafrica.json

topojson \
  -o asia.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentasia.json

topojson \
  -o oceania.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentoceania.json
