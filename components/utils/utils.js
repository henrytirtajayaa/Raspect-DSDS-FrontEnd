import { fabric } from "fabric";
import { refreshAccessToken } from "../../requests/user";
import {
  getexportImageOriginal,
  getgeneratedDocs
} from "../../requests/signboard";
import moment from "moment";

export const makeRoof = roofPoints => {
  var left = findLeftPaddingForRoof(roofPoints);
  var top = findTopPaddingForRoof(roofPoints);
  roofPoints.push(new Point(roofPoints[0].x, roofPoints[0].y));
  var roof = new fabric.Polyline(roofPoints, {
    fill: "rgba(0,0,0,0)",
    stroke: "#58c"
  });
  roof.set({
    left: left,
    top: top
  });

  return roof;
};

export const findTopPaddingForRoof = roofPoints => {
  var result = 999999;
  for (var f = 0; f < lineCounter; f++) {
    if (roofPoints[f].y < result) {
      result = roofPoints[f].y;
    }
  }
  return Math.abs(result);
};

export const findLeftPaddingForRoof = roofPoints => {
  var result = 999999;
  for (var i = 0; i < lineCounter; i++) {
    if (roofPoints[i].x < result) {
      result = roofPoints[i].x;
    }
  }
  return Math.abs(result);
};

export const makePointObject = (x, y) => {
  return { x, y };
};

export const retryAndSetStorage = async (callback, params) => {
  const { refreshToken, accessToken } = params;

  if (callback.name !== "logout") {
    window.localStorage.setItem("accessToken", accessToken);
    window.localStorage.setItem("refreshToken", refreshToken);
  }

  if (callback.name === "searchTrips") {
    const { boundary, startDate, endDate, accessToken } = params;

    return await callback(boundary, startDate, endDate, accessToken);
  }

  if (callback.name === "getDistricts") {
    return await callback(accessToken);
  }

  if (callback.name === "searchSignboards") {
    const {
      boundary,
      startDate,
      endDate,
      keyword,
      status,
      isDefective,
      accessToken
    } = params;

    return await callback(accessToken, {
      boundary,
      startDate,
      endDate,
      keyword,
      status,
      isDefective,
      accessToken
    });
  }

  return await callback(...params);
};

export const anchorWrapper = (anchorIndex, fn) => {
  return function(eventData, transform, x, y) {
    var fabricObject = transform.target,
      absolutePoint = fabric.util.transformPoint(
        {
          x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
          y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
        },
        fabricObject.calcTransformMatrix()
      ),
      actionPerformed = fn(eventData, transform, x, y),
      newDim = fabricObject._setPositionDimensions({}),
      polygonBaseSize = fabricObject._getNonTransformedDimensions(),
      newX =
        (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
        polygonBaseSize.x,
      newY =
        (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
        polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  };
};

export const actionHandler = (eventData, transform, x, y) => {
  var polygon = transform.target,
    currentControl = polygon.controls[polygon.__corner],
    mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    ),
    polygonBaseSize = polygon._getNonTransformedDimensions(),
    size = polygon._getTransformedDimensions(0, 0),
    finalPointPosition = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y
    };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
};

export const exportImage = async id => {
  let c = document.getElementById(id);
  let canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 853;
  canvas.getContext("2d").drawImage(c, 0, 0, 1280, 853);
  let blob = new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, "image/jpeg");
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(await blob);
  link.download = `${moment().format("DD/MM/YYYY")}.jpeg`;
  link.click();
};

export const exportImageOriginal = async (
  imgTitle,
  tripId,
  { accessToken }
) => {
  const imgName = imgTitle.match("/(.*)");
  const response = await getexportImageOriginal(imgName, tripId, {
    accessToken
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `${moment().format("DD/MM/YYYY")}-original.jpeg`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const processArray = (arrayToBeCopied, newValue, indexToInsert) => {
  let temp = [];
  temp = [...arrayToBeCopied];
  temp[indexToInsert] = newValue;
  return temp;
};

export const refreshWrapper = async originalFunction => {
  // assume positional arguments is given up and use arguments with object
  async function wrappedFunction() {
    const response = await originalFunction({ ...arguments[0] });
    if (response === 401) {
      const newTokenPair = await refreshAccessToken(
        window.localStorage.getItem("userId"),
        window.localStorage.getItem("refreshToken")
      );

      if (newTokenPair === 401) {
        redirectLogin();
      }

      const {
        data: { refreshToken, accessToken, userId }
      } = newTokenPair;

      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("refreshToken", refreshToken);

      return originalFunction({ ...arguments[0], accessToken });
    } else {
      return response;
    }
  }

  return wrappedFunction;
};

export const mapCoordinates = coordinateObject => {
  const { signboardAnnotation } = coordinateObject;
  const realCoordinates = coordinatesManipulation(
    signboardAnnotation.location.coordinates[0]
  );
  
  const status = coordinateObject.status ?? null;
  const selectionOrder = coordinateObject.selectionOrder ?? null;
  let strokeColor = "";

  if (status === null) {
    if (coordinateObject?.defectAnnotations?.length > 0){
      strokeColor = "red";
    } else if (selectionOrder < 3) {
      strokeColor = "yellow";
    } else {
      strokeColor = "white";
    }
  } else {
    strokeColor = "#0091FF";
  }

  return { coordinates: realCoordinates, strokeColor };
};

export const getPrecision = zoomLevel => {
  if (zoomLevel < 15) {
    return 2;
  } else if (15 <= zoomLevel && zoomLevel < 16) {
    return 2;
  } else if (16 <= zoomLevel && zoomLevel < 17) {
    return 3;
  } else if (17 <= zoomLevel && zoomLevel < 18) {
    return 3;
  } else if (18 <= zoomLevel && zoomLevel < 19) {
    return 4;
  } else if (19 <= zoomLevel && zoomLevel < 20) {
    return 4;
  } else if (20 <= zoomLevel) {
    return 5;
  } else {
    return 2;
  }
};

export const coordinatesManipulation = coordinates => {
  if (coordinates[0][0] !== coordinates[1][0] && coordinates.length == 4) {
    return [coordinates[0], coordinates[3], coordinates[2], coordinates[1]];
  } else {
    return coordinates;
  }
};

export const downloadGeneratedDocs = async ({ downloadLink, fileName }) => {
  const response = await getgeneratedDocs({ downloadLink });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const redirectLogin = () => {
  window.localStorage.removeItem("refreshToken");
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("userId");
  window.$nuxt.$router.push("/");
}
