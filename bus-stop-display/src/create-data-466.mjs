import FourSixtySixRoute from "./data/routes/466.json" assert { type: "json" };
import londonNaptanData from "./data/naptan/490.json" assert { type: "json" };
import proj4 from "proj4";

// takes in the full route data, such as the 205.json file
// and returns the coordinates of the stop point refs along the inbound and outbound routes;
// the returned stop point refs are not correctly ordered
export function getUnorderedStopPointRefs(route, naptanData) {
  const data = [];

  for (const path of route.TransXChange.StopPoints.AnnotatedStopPointRef) {
    try {
      const naptanData = naptanData.NaPTAN.StopPoints.StopPoint.find(
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

// gets all the route refs so you can see all possible journeys for a given route
export function getRouteRefs(route) {
  return route.TransXChange.Routes.Route.map((route, i) => ({
    routeRef: `R_${i + 1}`,
    description: route.Description,
  }));
}

export function convertToLatLong(easting, northing) {
  // Define the British National Grid projection
  const bng =
    "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
    "+x_0=400000 +y_0=-100000 +ellps=airy " +
    "+towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 " +
    "+units=m +no_defs";

  // Convert the easting and northing to latitude and longitude
  const latLong = proj4(bng, "WGS84", [easting, northing]);

  return { latitude: latLong[1], longitude: latLong[0] };
}

// routeDescription is the description of the route e.g. Post Office - Waitrose
// we can use typescript in the future here for autocompletion
export function getOrderedStopPointRefs(route, naptanData, routeDescription) {
  const routeSectionRefs = route.TransXChange.Routes.Route.find(
    (r) => r.Description === routeDescription
  );

  if (!routeSectionRefs) {
    throw Error("That route does not exist in this TransXChange");
  }

  const routeSections = route.TransXChange.RouteSections.RouteSection;
  const orderedStopPointRefs = [];

  for (const routeSectionRef of routeSectionRefs.RouteSectionRef) {
    const routeSection = routeSections.find(
      (section) => section._id === routeSectionRef
    );

    for (const [i, stopPointRef] of routeSection.RouteLink.entries()) {
      const fromNaptanData = naptanData.NaPTAN.StopPoints.StopPoint.find(
        (point) => {
          return point.AtcoCode === stopPointRef.From.StopPointRef;
        }
      );
      if (!fromNaptanData) {
        continue;
      }
      const fromCommonName =
        route.TransXChange.StopPoints.AnnotatedStopPointRef.find(
          (ref) => ref.StopPointRef === stopPointRef.From.StopPointRef
        ).CommonName;

      const fromEasting = fromNaptanData.Place.Location.Easting;
      const fromNorthing = fromNaptanData.Place.Location.Northing;

      const fromCoordinates = convertToLatLong(
        Number(fromEasting),
        Number(fromNorthing)
      );
      orderedStopPointRefs.push({
        directionIndex: i,
        name: fromCommonName,
        atcoCode: fromNaptanData.AtcoCode,
        naptanCode: fromNaptanData.NaptanCode,
        lat: fromCoordinates.latitude,
        long: fromCoordinates.longitude,
      });

      if (i === routeSectionRefs.RouteSectionRef.length - 1) {
        const toNaptanData = naptanData.NaPTAN.StopPoints.StopPoint.find(
          (point) => {
            return point.AtcoCode == stopPointRef.To.StopPointRef;
          }
        );
        if (!toNaptanData) {
          continue;
        }
        const toCommonName =
          route.TransXChange.StopPoints.AnnotatedStopPointRef.find(
            (ref) => ref.StopPointRef === stopPointRef.To.StopPointRef
          ).CommonName;

        const toEasting = toNaptanData.Place.Location.Easting;
        const toNorthing = toNaptanData.Place.Location.Northing;

        const toCoordinates = convertToLatLong(
          Number(toEasting),
          Number(toNorthing)
        );

        orderedStopPointRefs.push({
          directionIndex: i + 1,
          name: toCommonName,
          atcoCode: toNaptanData.AtcoCode,
          naptanCode: toNaptanData.NaptanCode,
          lat: toCoordinates.latitude,
          long: toCoordinates.longitude,
        });
      }
    }
  }

  return orderedStopPointRefs;
}

console.log(
  getOrderedStopPointRefs(
    FourSixtySixRoute,
    londonNaptanData,
    "Addington Village Interchange - Westway_ Caterham"
  )
);

// function writeDataToFile(filename, data) {
//   const filePath = path.join(__dirname, filename);

//   // Convert the data to a string if it's not already
//   const dataString =
//     typeof data === "string" ? data : JSON.stringify(data, null, 2);

//   fs.writeFile(filePath, dataString, { flag: "a+" }, (err) => {
//     if (err) {
//       console.error("Error writing to file:", err);
//       return;
//     }
//     console.log(`Data written to ${filename}`);
//   });
// }

// get line coordinates of full route
// routeDescription is the description of the route e.g. Post Office - Waitrose
// we can use typescript in the future here for autocompletion
export function getLineCoordinates(route, routeDescription) {
  const routeSectionRefs = route.TransXChange.Routes.Route.find(
    (r) => r.Description === routeDescription
  );

  const routeSections = route.TransXChange.RouteSections.RouteSection;
  const lineCoordinates = [];

  for (const r of routeSectionRefs.RouteSectionRef) {
    const routeIndex = extractInteger(r) - 1;
    const routeSection = routeSections[routeIndex];

    const coordinates = routeSection.RouteLink.Track.Mapping.Location.map(
      (c) => [c.Translation.Latitude, c.Translation.Longitude]
    );

    lineCoordinates.push(...coordinates);
  }

  return lineCoordinates;
}

// console.log(JSON.stringify(getLineCoordinates("Waitrose - Castle")));
