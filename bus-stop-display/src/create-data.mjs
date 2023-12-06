import TwoOhFiveRoute from "./data/routes/205.json" assert { type: "json" };
import KentNaptanData from "./data/naptan/240.json" assert { type: "json" };

export function createBusData() {
  const data = [];

  for (const path of TwoOhFiveRoute.TransXChange.StopPoints
    .AnnotatedStopPointRef) {
    try {
      const naptanData = KentNaptanData.NaPTAN.StopPoints.StopPoint.find(
        (point) => {
          return point.AtcoCode == path?.StopPointRef;
        }
      );
      if (naptanData) {
        data.push({
          name: path.CommonName,
          atcoCode: naptanData.AtcoCode,
          naptanCode: naptanData.NaptanCode,
          lat: naptanData.Place.Location.Translation.Latitude,
          long: naptanData.Place.Location.Translation.Longitude,
        });
        continue;
      }
    } catch (e) {
      console.error(e);
    }

    console.warn(
      `Could not find naptan data for ${path.CommonName}; ${path.StopPointRef}`
    );
  }

  return data;
}

console.log(createBusData());
