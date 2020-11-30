/*
	Title:
		Custom Maths
	
	Description:
		Holds all information for Maths
*/

//store custom math seperations
window.cMaths = new function customMathFunctions()
{
    //functions/classes
    this.lineMaths = new customMathLineMathFunctions();
    this.collision = new customMathCollisionFunctions();
    this.maths = new customMathGenericFunctions();
    this.position = new customMathPositioningFunctions();

    //data types
    this.dataTypes = new customMathTypeData();
    
    this.Vector2 = this.dataTypes.vector2.prototype;
    this.vector2 = this.dataTypes.vector2;

    this.Line = this.dataTypes.line.prototype;
    this.line = this.dataTypes.line;

    this.Vector3 = this.dataTypes.vector3.prototype;
    this.vector3 = this.dataTypes.vector3;

    this.Vector4 = this.dataTypes.vector4.prototype;
    this.Vector4 = this.dataTypes.Vector4;

    this.Bounds = this.dataTypes.bounds.prototype;
    this.bounds = this.dataTypes.bounds;

    //realtime data
    this.viewportOffset = new this.vector2();

    function updateViewportOffset()
    {
        cMaths.viewportOffset = cMaths.position.getPageViewportOffsetFromPage();
    }

    window.addEventListener("scroll", updateViewportOffset);
    window.addEventListener("resize", updateViewportOffset)

}

//hold data types
function customMathTypeData()
{

    function vector2(_x, _y)
    {
        this.x = _x || 0;
        this.y = _y || 0;
    }

    vector2.prototype = 
    {
        set: function(_x, _y)
        {
            this.x = _x || 0;
            this.y = _y || 0;
        },

        clone: function()
        {
            return new vector2(this.x, this.y);
        },

        add: function(_vector)
        {
            return new vector2(this.x + _vector.x, this.y + _vector.y);
        },

        subtract: function(_vector)
        {
            return new vector2(this.x - _vector.x, this.y - _vector.y);
        },

        scale: function(_scalar)
        {
            return new vector2(this.x * _scalar, this.y * _scalar);
        },

        dot: function(_vector)
        {
            return new vector2(this.x * _vector.x, this.y * _vector.y);
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },
    
        distanceSqr: function (_vector) {
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            return (deltaX * deltaX + deltaY * deltaY);
        }
    }

    this.vector2 = vector2;

    function vector3(_x, _y, _z)
    {
        this.x = _x || 0;
        this.y = _y || 0;
        this.z = _z || 0;
    }

    vector3.prototype = 
    {
        set: function(_x, _y, _z)
        {
            this.x = _x || 0;
            this.y = _y || 0;
            this.z = _z || 0;
        },

        clone: function()
        {
            return new vector3(this.x, this.y, this.z);
        },

        vector2: function()
        {
            return new vector2(this.x, this.y);
        },

        add: function(_vector)
        {
            return new vector3(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z);
        },

        subtract: function(_vector)
        {
            return new vector3(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z);
        },

        scale: function(_scalar)
        {
            return new vector3(this.x * _scalar, this.y * _scalar, this.z * _scalar);
        },

        dot: function(_vector)
        {
            return new vector3(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z);
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },
    
        distanceSqr: function (_vector) {
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            var deltaZ = this.z - _vector.z;
            return (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        }
    }

    this.vector3 = vector3;

    function vector4(_x, _y, _z, _w)
    {
        this.x = _x || 0;
        this.y = _y || 0;
        this.z = _z || 0;
        this.w = _w || 0;
    }

    vector4.prototype = 
    {
        set: function(_x, _y, _z, _w)
        {
            this.x = _x || 0;
            this.y = _y || 0;
            this.z = _z || 0;
            this.w = _w || 0;
        },

        clone: function()
        {
            return new vector4(this.x, this.y, this.z, this.w);
        },

        vector2: function()
        {
            return new vector2(this.x, this.y);
        },

        vector3: function()
        {
            return new vector3(this.x, this.y, this.z);
        },

        add: function(_vector)
        {
            return new vector4(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z, this.w + _vector.w);
        },

        subtract: function(_vector)
        {
            return new vector4(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z, this.w - _vector.w);
        },

        scale: function(_scalar)
        {
            return new vector4(this.x * _scalar, this.y * _scalar, this.z * _scalar, this.w * _scalar);
        },

        dot: function(_vector)
        {
            return new vector4(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z, this.w * _vector.w);
        }
    }

    this.vector4 = vector4;

    function bounds(_x1, _y1, _x2, _y2)
    {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
        this.topLeft = new vector2(_x1, _y1);
        this.topRight = new vector2(_x2, _y1);
        this.bottomRight = new vector2(_x2, _y2);
        this.bottomLeft = new vector2(_x1, _y2);
    }

    bounds.prototype =
    {
        set: function(_x1, _y1, _x2, _y2)
        {
            this.x1 = _x1;
            this.y1 = _y1;
            this.x2 = _x2;
            this.y2 = _y2;
            this.topLeft.set(_x1, _y1);
            this.topRight.set(_x2, _y1);
            this.bottomRight.set(_x2, _y2);
            this.bottomLeft.set(_x1, _y2);
        },

        clone: function()
        {
            return new bounds(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
        },

        add: function(_bounds)
        {
            return new bounds(this.x1 + _bounds.x1, this.y1 + _bounds.y1, this.x2 + _bounds.x2, this.y2 + _bounds.y2);
        },

        subtract: function(_bounds)
        {
            return new bounds(this.x1 - _bounds.x1, this.y1 - _bounds.y1, this.x2 - _bounds.x2, this.y2 - _bounds.y2);
        },

        scale: function(_scalar)
        {
            return new bounds(this.x1 * _scalar, this.y1 * _scalar, this.x2 * _scalar, this.y2 * _scalar);
        },

        dot: function(_bounds)
        {
            return new bounds(this.x1 * _bounds.x, this.y1 * _bounds.y, this.x2 * _bounds.x2, this.y2 * _bounds.y2);
        },

        fromVector2s: function(_pos1, _pos2)
        {
            return new bounds(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromObject: function(_object, _relative, _includeChildren)
        {
            //setup object bounds
            var _objectBounds =
            {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }

            //setup relative
            var _relative = _relative || document;
            
            var _includeChildren = _includeChildren || null;

            //setup JQuery object and add css class
            var _objectJQuery = $(_object);

            //get object bounds based on relative
            if (_relative !== null)
            {

                if (_objectJQuery.attr("type") !== "hidden" && _objectJQuery.attr("display") !== "hidden")
                {

                    var _position = cMaths.position.getCoords(_objectJQuery[0], _relative);

                    var _computedStyle = _object.currentStyle || window.getComputedStyle(_object);
                    var height = _object.clientHeight;
                    
                    height += cMaths.position.translateCssSizes(_object, "marginTop", _computedStyle);
                    height += cMaths.position.translateCssSizes(_object, "marginBottom", _computedStyle);
                    height += cMaths.position.translateCssSizes(_object, "borderTopWidth", _computedStyle);
                    height += cMaths.position.translateCssSizes(_object, "borderBottomWidth", _computedStyle);
                    
                    var width = _object.clientWidth;
                    
                    width += cMaths.position.translateCssSizes(_object, "marginLeft", _computedStyle);
                    width += cMaths.position.translateCssSizes(_object, "marginRight", _computedStyle);
                    width += cMaths.position.translateCssSizes(_object, "borderLeftWidth", _computedStyle);
                    width += cMaths.position.translateCssSizes(_object, "borderRightWidth", _computedStyle);
                    
                    _objectBounds.left = _position.x;
                    _objectBounds.top = _position.y;
                    _objectBounds.right = _objectBounds.left + width;
                    _objectBounds.bottom = _objectBounds.top + height;

                }
                else
                {
                    return null;
                }
            }
            else
            {
                console.warn("Bounds relative: " + _relative + " is not an option");
                return null;
            }

            if (_includeChildren !== null && _includeChildren.length > 0)
            {                
                
                for (var l = 0; l < _includeChildren.length; l++)
                {

                    var _childrenJQuery = _objectJQuery.find(_includeChildren[l]);
                    if (_childrenJQuery.length > 0)
                    {
                        //loop through all children and find largest bounds
                        _childrenJQuery.each(function() {

                            //get child bounds and check if child bounds are outside parent bounds
                            var _tempBounds = cMaths.Bounds.fromObject(this);

                            if (_tempBounds !== null)
                            {
                                if (_tempBounds.x1 < _objectBounds.left)
                                {
                                    _objectBounds.left = _tempBounds.x1;
                                }

                                if (_tempBounds.y1 < _objectBounds.top)
                                {
                                    _objectBounds.top = _tempBounds.y1;
                                }

                                if (_tempBounds.x2 > _objectBounds.right)
                                {
                                    _objectBounds.right = _tempBounds.x2;
                                }

                                if (_tempBounds.y2 > _objectBounds.bottom)
                                {
                                    _objectBounds.bottom = _tempBounds.y2;
                                }
                            }
                        });

                        break;
                    }
                }
            }

            return new bounds(_objectBounds.left,
                                _objectBounds.top,
                                _objectBounds.right,
                                _objectBounds.bottom);
        }
    }

    this.bounds = bounds;

    function line(_x1, _y1, _x2, _y2)
    {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
    }

    line.prototype =
    {
        fromVector2s: function(_pos1, _pos2)
        {
            return new line(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromVector4: function(_vector)
        {
            return new line(_vector.x, _vector.y, _vector.z, _vector.w);
        },

        distance: function () {
            return Math.sqrt(this.distanceSqr());
        },
    
        distanceSqr: function () {
            var deltaX = this.x1 - this.x2;
            var deltaY = this.y1 - this.y2;
            return (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        }
    }

    this.line = line;

}

//hold collision/bounds testing functions
function customMathCollisionFunctions()
{

    //return any objects from _objects where object's bounds are within _areaBounds
    this.returnObjectsWithinArea = function(_areaBounds, _objects)
    {
        var ret = [];

        for (var i = 0; i < _objects.length; i++)
        {
            //get object's bounds
            var _otherBounds = cMaths.Bounds.fromObject(_objects[i]);

            //check if object bounds is within _areaBounds
            if (this.checkAreaWithinArea(_areaBounds, _otherBounds))
            {
                ret.push(_objects[i]);
            }
        }

        return ret;
    }

    //return any objects from _objects where object's bounds intersect _areaBounds
    this.returnObjectsIntersectArea = function(_areaBounds, _objects)
    {
        var ret = [];

        for (var i = 0; i < _objects.length; i++)
        {
            //get object's bounds
            var _otherBounds = cMaths.Bounds.fromObject(_objects[i]);

            //check if object bounds intersects _areaBounds
            if (this.checkAreaIntersectsArea(_areaBounds, _otherBounds))
            {
                ret.push(_objects[i]);
            }
        }

        return ret;
    }

    //check if a point is within bounds
    this.checkPointWithinArea = function(_areaBounds, _point)
    {
        if (_areaBounds.topLeft.x <= _point.x &&
            _areaBounds.topLeft.y <= _point.y &&
            _areaBounds.bottomRight.x >= _point.x &&
            _areaBounds.bottomRight.y >= _point.y)
        {

            return true;
            
        }

        return false;
    }

    //check if an area is completly within another
    this.checkAreaWithinArea = function(_areaBounds, _otherBounds)
    {
        var _cornersWithin = 0;

        //setup corners to test
        var _pointsToCheck = [_otherBounds.topLeft, _otherBounds.topRight,
                             _otherBounds.bottomLeft, _otherBounds.bottomRight];
             
        //loop through corners and test if they are within the area
        for (var _pointIndex = 0; _pointIndex < 4; _pointIndex++)
        {
            if (this.checkPointWithinArea(_areaBounds, _pointsToCheck[_pointIndex]))
            {
                _cornersWithin++;
            }
        }

        //if all 4 corners within area return true
        if (_cornersWithin == 4)
        {
            return true;
        }

        return false;
    }

    //check if an area is completly enveloped by another
    this.checkAreaEnvelopedByArea = function(_areaBounds, _otherBounds)
    {
        return this.checkAreaWithinArea(_otherBounds, _areaBounds);
    }

    //check if an area intersects another anywhere
    this.checkAreaIntersectsArea = function(_areaBounds, _otherBounds)
    {

        //setup corners of _otherBounds and check if they are inside _areaBounds
        var _pointsToCheck = [new cMaths.vector2(_otherBounds.topLeft.x, _otherBounds.topLeft.y),
                                new cMaths.vector2(_otherBounds.bottomRight.x, _otherBounds.topLeft.y),
                                new cMaths.vector2(_otherBounds.bottomRight.x, _otherBounds.bottomRight.y),
                                new cMaths.vector2(_otherBounds.topLeft.x, _otherBounds.bottomRight.y)];

        for (var i = 0; i < 4; i++)
        {
            if (this.checkPointWithinArea(_areaBounds, _pointsToCheck[i]))
            {
                return true;
            }
        }

        //setup all lines from _areaBounds and _otherBounds and check if they intersect
        var _linesToCheck = [cMaths.Line.fromVector2s(_otherBounds.topLeft, _otherBounds.topRight),
            cMaths.Line.fromVector2s(_otherBounds.topRight, _otherBounds.bottomRight),
            cMaths.Line.fromVector2s(_otherBounds.bottomRight, _otherBounds.bottomLeft),
            cMaths.Line.fromVector2s(_otherBounds.bottomLeft, _otherBounds.topLeft)];

        var _linesToCheckAgainst = [cMaths.Line.fromVector2s(_areaBounds.topLeft, _areaBounds.topRight),
            cMaths.Line.fromVector2s(_areaBounds.topRight, _areaBounds.bottomRight),
            cMaths.Line.fromVector2s(_areaBounds.bottomRight, _areaBounds.bottomLeft),
            cMaths.Line.fromVector2s(_areaBounds.bottomLeft, _areaBounds.topLeft)];

        //do line intersect tests
        for (var line1 = 0; line1 < 4; line1++)
        {
            for (var line2 = 0; line2 < 4; line2++)
            {
                if (cMaths.lineMaths.lineIntersectionWithin(_linesToCheck[line1],_linesToCheckAgainst[line2]))
                {
                    return true;
                }
            }
        }

        return false;
    }

}

//Holds line functions
function customMathLineMathFunctions()
{

    //find and return intersection point of lines if result is
    //within the two lines
    this.lineIntersectionWithin = function(_line1, _line2)
    {
        var _intersection = this.lineIntersection(_line1, _line2);

        if (_intersection == null) {return null;}

        //check if line interception is within line 1 x
        if (_line1.x1 >= _line1.x2)
        {
            if (cMaths.maths.between(_line1.x2, _intersection.x, _line1.x1, 0.000002) == false) {return null;}
        } else {
            if (cMaths.maths.between(_line1.x1, _intersection.x, _line1.x2, 0.000002) == false) {return null;}
        }

        //check if line interception is within line 1 y
        if (_line1.y1 >= _line1.y2)
        {
            if (cMaths.maths.between(_line1.y2, _intersection.y, _line1.y1, 0.000002) == false) {return null;}
        }
        else
        {
            if (cMaths.maths.between(_line1.y1, _intersection.y, _line1.y2, 0.000002) == false) {return null;}
        }

        //check if line interception is within line 2 x
        if (_line2.x1 >= _line2.x2)
        {
            if (cMaths.maths.between(_line2.x2, _intersection.x, _line2.x1, 0.000002) == false) {return null;}
        } else {
            if (cMaths.maths.between(_line1.x1, _intersection.x, _line1.x2, 0.000002) == false) {return null;}
        }

        //check if line interception is within line 2 y
        if (_line2.y1 >= _line2.y2)
        {
            if (cMaths.maths.between(_line2.y2, _intersection.y, _line2.y1, 0.000002) == false) {return null;}
        }
        else
        {
            if (cMaths.maths.between(_line2.y1, _intersection.y, _line2.y2, 0.000002) == false) {return null;}
        }

        return _intersection;
    }

    //return the line intersection point
    this.lineIntersection = function(_line1, _line2)
    {
        //Do line intersection calculation stuff? 
        //en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Mathematics

        var _lineIntersect = {
            x : null,
            y : null
        }

        var div = (_line1.x1 - _line1.x2) * (_line2.y1 - _line2.y2)
                - (_line1.y1 - _line1.y2) * (_line2.x1 - _line2.x2);

        _lineIntersect.x = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.x1 - _line2.x2) 
            - (_line1.x1 - _line1.x2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.x /= div;
        
        _lineIntersect.y = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.y1 - _line2.y2) 
            - (_line1.y1 - _line1.y2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.y /= div;

        //check values are valid
        if (isNaN(_lineIntersect.x) || isNaN(_lineIntersect.y) )
        {
            return null;
        }

        return _lineIntersect;
    }
    
}

//Holds math functions
function customMathGenericFunctions()
{

    //check if value between min/max with epsilon accuracy
    this.between = function(_min, _val, _max, _eps)
    {
        var _eps = _eps || 0;
        return (_min - _eps < _val  && _val < _max + _eps);
    }
    
}

function customMathPositioningFunctions()
{

    this.getPageViewportOffsetFromPage = function getPageViewportOffsetFromPage()
    {
        var body = document.body;
        var docEl = document.documentElement;

        return new cMaths.vector2(
            (window.pageXOffset || docEl.scrollLeft || body.scrollLeft) - (docEl.clientLeft || body.clientLeft || 0)
            , (window.pageYOffset || docEl.scrollTop || body.scrollTop) - (docEl.clientTop || body.clientTop || 0));
    }

    this.getCoords = function getCoords(_object, _relativeTo) 
    {

        var _objectPosition = new cMaths.vector2();

        if (_relativeTo === "screen")
        {
            var box = _object.getBoundingClientRect();

            _objectPosition.x = box.left;
            _objectPosition.y = box.top;
        }
        else
        {

            if (_relativeTo === _object.offsetParent)
            {
                _objectPosition.x = _object.offsetLeft;
                _objectPosition.y = _object.offsetTop;
            }
            else 
            {
                //calculate position offset from viewport 
                var box = _object.getBoundingClientRect();
        
                _objectPosition.x = box.left;
                _objectPosition.y = box.top;

                //if relative to exists then calculate offset from that
                if (_relativeTo !== null && _relativeTo !== document)
                {
                    var _otherBox = _relativeTo.getBoundingClientRect();

                    _objectPosition.x -= _otherBox.left;
                    _objectPosition.y -= _otherBox.top;
                }

                _objectPosition.add(cMaths.viewportOffset);
            }

        }

        return _objectPosition;
    }

    this.translateCssSizes = function translateCssSizes(_object, _css, _computedStyle)
    {

        var _computedStyle = _computedStyle || _object.currentStyle || window.getComputedStyle(_object);

        switch(_computedStyle[_css])
        {
            case "thin":
                return 1;
            case "medium":
                return 2.5;
            case "thick":
                return 5;
            case "auto":
                return 0;
            case "inherit":
                if (_object)
                {
                    return translateCssSizes(_object.offsetParent, _css, null)
                }
                return 0;
            default:
                return parseInt(_computedStyle[_css], 10);
        }
    }
}