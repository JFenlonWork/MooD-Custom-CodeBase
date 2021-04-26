# <a id="title"/> bounds
### <a id="description"/> Holds information for box bounding coordinates and some common functions
#

#### <a id="codeexample"/> Code Example:
```Javascript
cMaths.bounds(_x1, _y1, _x2, _y2)
```

* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_x1"/> _x1 <p style="padding-left: 20px;"> The x position of the first point. </p> <br>

    * <a id="_y1"/> _y1 <p style="padding-left: 20px;"> The y position of the first point. </p> <br>

    * <a id="_x2"/> _x2 <p style="padding-left: 20px;"> The x position of the second point. </p> <br>

    * <a id="_y2"/> _y2 <p style="padding-left: 20px;"> The y position of the second point. </p> <br>

* <a id="properties"/> <h2> Properties: </h2>

    * <a id="propertiesprefix"/> All of the parameters are accessible without "_". <p style="padding-left: 20px;">  </p> <br>

    * <a id="topleft"/> topLeft <p style="padding-left: 20px;"> The top left point of the bound. </p> <br>

    * <a id="topright"/> topRight <p style="padding-left: 20px;"> The top right point of the bound. </p> <br>

    * <a id="bottomleft"/> bottomLeft <p style="padding-left: 20px;"> The bottom left point of the bound. </p> <br>

    * <a id="bottomright"/> bottomRight <p style="padding-left: 20px;"> The bottom right point of the bound. </p> <br>

    * <a id="size"/> size <p style="padding-left: 20px;"> The width/height of the bound. </p> <br>

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="set"/> set(_x1, _y1, _x2, _y2) <p style="padding-left: 20px;"> Set all the properties x1/y1/x2/y2 to _x1/_y1/_x2/_y2. </p> <br>
  
    * <a id="setx1"/> setX1(_x1) <p style="padding-left: 20px;"> Set property x1 to _x1. </p> <br>
  
    * <a id="sety1"/> setY1(_y1) <p style="padding-left: 20px;"> Set property y1 to _y1. </p> <br>
  
    * <a id="setx2"/> setX2(_x2) <p style="padding-left: 20px;"> Set property x2 to _x2. </p> <br>
  
    * <a id="sety2"/> setY2(_y2) <p style="padding-left: 20px;"> Set property y2 to _y2. </p> <br>

    * <a id="setbound"/> setBound(_bound) <p style="padding-left: 20px;"> Set property x1/y1/x2/y2 to _bound's x1/y1/x2/y2. </p> <br>

    * <a id="clone"/> clone() <p style="padding-left: 20px;"> Returns a new bounds with the same values. </p> <br>

    * <a id="add"/> add(_bound) <p style="padding-left: 20px;"> Returns a new bounds with the _bound added to the original values. </p> <br>

    * <a id="addoriginal"/> Add(_bound) <p style="padding-left: 20px;"> Returns this bounds with _bound added to the original values. </p> <br>

    * <a id="subtract"/> subtract(_bound) <p style="padding-left: 20px;"> Returns a new bounds with the _bound subtracted from the original values. </p> <br>

    * <a id="Subtract"/> Subtract(_bound) <p style="padding-left: 20px;"> Returns this bounds with _bound subtracted from the original values. </p> <br>

    * <a id="scale"/> scale(_scaler) <p style="padding-left: 20px;"> Returns a new bounds with the original values scaled by the _scalar value. </p> <br>

    * <a id="Scale"/> Scale(_scaler) <p style="padding-left: 20px;"> Returns this bounds with the original values scaled by the _scalar value. </p> <br>

    * <a id="dot"/> dot(_bound) <p style="padding-left: 20px;"> Returns a new bounds with the original values multiplied by the bound's value. </p> <br>

    * <a id="Dot"/> Dot(_bound) <p style="padding-left: 20px;"> Returns this bounds with the original values multiplied by the bound's value. </p> <br>

    * <a id="fromvector2s"/> fromVector2s(_pos1, _pos2) <p style="padding-left: 20px;"> Returns a new bounds from two vector2 (points). </p> <br>

    * <a id="fromvector4"/> fromVector4(_vector) <p style="padding-left: 20px;"> Returns a new bounds from a single vector4. </p> <br>

    * <a id="fromobject"/> fromObject(_object, _relative, _includeChildren) <p style="padding-left: 20px;"> Returns a new bounds from a DOM object that is based on the origin of _relative if provided or the [document](https://developer.mozilla.org/en-US/docs/Web/API/Document) and includes any child elements based on the _includeChildren which is an array of JQuery search terms. </p> <br>

    * <a id="updateextras"/> updateExtras() <p style="padding-left: 20px;"> Updates the size and sides properties to reflect new values. </p> <br>

#### References: 

[Return to parent](/Code/Main%20Code/Maths/README.md)