import TwoOhFiveRoute from "./data/routes/205.json" assert { type: "json" };
import KentNaptanData from "./data/naptan/240.json" assert { type: "json" };

// takes in the full route data, such as the 205.json file
// and returns the coordinates of the stop point refs along the inbound and outbound routes;
// the returned stop point refs are not correctly ordered
export function getUnorderedStopPointRefs(route, naptanData) {
  const data = [];

  for (const path of route.TransXChange.StopPoints.AnnotatedStopPointRef) {
    try {
      const naptanData = napatanData.NaPTAN.StopPoints.StopPoint.find(
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

function extractInteger(str) {
  var matches = str.match(/\d+/);
  if (matches) {
    return parseInt(matches[0], 10);
  }
  return null; // Return null if no number is found
}

// routeDescription is the description of the route e.g. Post Office - Waitrose
// we can use typescript in the future here for autocompletion
export function getOrderedStopPointRefs(route, routeDescription, naptanData) {
  const routeSectionRefs = route.TransXChange.Routes.Route.find(
    (r) => r.Description === routeDescription
  );

  if (!routeSectionRefs) {
    throw Error("That route does not exist in this TransXChange");
  }

  const routeSections = route.TransXChange.RouteSections.RouteSection;
  const orderedStopPointRefs = [];

  for (const [i, r] of routeSectionRefs.RouteSectionRef.entries()) {
    const routeIndex = extractInteger(r) - 1;
    const routeSection = routeSections[routeIndex];
    const fromNaptanData = naptanData.NaPTAN.StopPoints.StopPoint.find(
      (point) => {
        return point.AtcoCode == routeSection.RouteLink.From.StopPointRef;
      }
    );

    const fromCommonName =
      route.TransXChange.StopPoints.AnnotatedStopPointRef.find(
        (ref) => ref.StopPointRef === routeSection.RouteLink.From.StopPointRef
      ).CommonName;

    orderedStopPointRefs.push({
      directionIndex: i,
      name: fromCommonName,
      atcoCode: fromNaptanData.AtcoCode,
      naptanCode: fromNaptanData.NaptanCode,
      lat: fromNaptanData.Place.Location.Translation.Latitude,
      long: fromNaptanData.Place.Location.Translation.Longitude,
    });

    if (i === routeSectionRefs.RouteSectionRef.length - 1) {
      const toNaptanData = naptanData.NaPTAN.StopPoints.StopPoint.find(
        (point) => {
          return point.AtcoCode == routeSection.RouteLink.To.StopPointRef;
        }
      );
      const toCommonName =
        route.TransXChange.StopPoints.AnnotatedStopPointRef.find(
          (ref) => ref.StopPointRef === routeSection.RouteLink.To.StopPointRef
        ).CommonName;

      orderedStopPointRefs.push({
        directionIndex: i + 1,
        name: toCommonName,
        atcoCode: toNaptanData.AtcoCode,
        naptanCode: toNaptanData.NaptanCode,
        lat: toNaptanData.Place.Location.Translation.Latitude,
        long: toNaptanData.Place.Location.Translation.Longitude,
      });
    }
  }

  return orderedStopPointRefs;
}

console.log(
  JSON.stringify(
    getOrderedStopPointRefs(TwoOhFiveRoute, "Waitrose - Castle", KentNaptanData)
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
