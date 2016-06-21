!# /bin/sh

# Download layers from naturalearthdata.com: ne_10m_admin_0_map_subunits
wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_map_subunits.zip

unzip ne_10m_admin_0_map_subunits.zip

# Convert data to GeoJSON format
ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Africa'" \
  continenttest.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

# Convert to TopoJSON format
topojson \
  -o africa.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continenttest.json
