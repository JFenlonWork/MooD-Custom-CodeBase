# <a id="title"/> line
### <a id="description"/> Holds information for a line and some common functions
#

#### <a id="codeexample"/> Code Example:
```Javascript
cMaths.line(_x1, _y1, _x2, _y2)
```

* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_x1"/> _x1 <p style="padding-left: 20px;"> The x position of the first point. </p> <br>

    * <a id="_y1"/> _y1 <p style="padding-left: 20px;"> The y position of the first point. </p> <br>

    * <a id="_x2"/> _x2 <p style="padding-left: 20px;"> The x position of the second point. </p> <br>

    * <a id="_y2"/> _y2 <p style="padding-left: 20px;"> The y position of the second point. </p> <br>

* <a id="properties"/> <h2> Properties: </h2>

    * <a id="propertiesprefix"/> All of the parameters are accessible without "_". <p style="padding-left: 20px;">  </p> <br>

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="set"/> set(_x1, _y1, _x2, _y2) <p style="padding-left: 20px;"> Set all the properties x1/y1/x2/y2 to _x1/_y1/_x2/_y2. </p> <br>

    * <a id="distance"/> distance() <p style="padding-left: 20px;"> Returns Euclidian distance. </p> <br>

    * <a id="distancesqr"/> distanceSqr() <p style="padding-left: 20px;"> Returns Euclidian distance squared. </p> <br>
  
    * <a id="fromvector2s"/> fromVector2s(_pos1, _pos2) <p style="padding-left: 20px;"> Returns a new bounds from two vector2 (points). </p> <br>

    * <a id="fromvector4"/> fromVector4(_vector) <p style="padding-left: 20px;"> Returns a new bounds from a single vector4. </p> <br>

#### References: 

[Return to parent](/Code/Main%20Code/Maths/README.md)