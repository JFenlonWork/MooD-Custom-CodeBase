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

    this.HtmlBounds = this.dataTypes.htmlBounds.prototype;
    this.htmlBounds = this.dataTypes.htmlBounds;

    //realtime data
    this.viewportOffset = new this.vector2();

    function updateViewportOffset()
    {
        cMaths.viewportOffset = cMaths.position.getPageViewportOffsetFromPage();
    }

    window.addEventListener("scroll", updateViewportOffset);
    window.addEventListener("resize", updateViewportOffset);

}

//hold data types
function customMathTypeData()
{

    this.vector2 = function vector2(_x, _y)
    {
        this.x = _x === undefined ? null : _x;
        this.y = _y === undefined ? null : _y;
    }

    this.vector2.prototype = 
    {
        set: function(_x, _y)
        {
            this.x = _x === undefined ? null : _x;
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setX: function(_x)
        {
            this.x = _x === undefined ? null : _x;
            return this;
        },

        setY: function(_y)
        {
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setVector: function(_vector)
        {
            if (_vector == null) { return null; }
            
            this.x = _vector.x === undefined ? null : _vector.x;
            this.y = _vector.y === undefined ? null : _vector.y;

            return this;
        },

        clone: function()
        {
            return new cMaths.vector2(this.x, this.y);
        },

        add: function(_vector)
        {
            return _vector == null ? this.clone() : new cMaths.vector2(this.x + _vector.x, this.y + _vector.y);
        },

        Add: function(_vector)
        {
            if (_vector != null)
            {
                this.x += _vector.x;
                this.y += _vector.y;
            }

            return this;
        },

        subtract: function(_vector)
        {
            return _vector == null ? this.clone() : new cMaths.vector2(this.x - _vector.x, this.y - _vector.y);
        },

        Subtract: function(_vector)
        {
            if (_vector != null)
            {
                this.x -= _vector.x;
                this.y -= _vector.y;
            }

            return this;
        },

        scale: function(_scalar)
        { 
            return _scalar == null ? null : new cMaths.vector2(this.x * _scalar, this.y * _scalar);
        },

        Scale: function(_scalar)
        {
            this.x *= _scalar;
            this.y *= _scalar;

            return this;
        },

        dot: function(_vector)
        {
            return _vector == null ? null : new cMaths.vector2(this.x * _vector.x, this.y * _vector.y);
        },

        Dot: function(_vector)
        {
            if (_vector != null)
            {
                this.x *= _vector.x;
                this.y *= _vector.y;
            }

            return this;
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },
    
        distanceSqr: function (_vector) {
            if (_vector == null) { return NaN; }
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            return (deltaX * deltaX + deltaY * deltaY);
        }
    }

    this.vector3 = function vector3(_x, _y, _z)
    {
        this.x = _x === undefined ? null : _x;
        this.y = _y === undefined ? null : _y;
        this.z = _z === undefined ? null : _z;
    }

    this.vector3.prototype = 
    {
        set: function(_x, _y, _z)
        {
            this.x = _x === undefined ? null : _x;
            this.y = _y === undefined ? null : _y;
            this.z = _z === undefined ? null : _z;
            return this;
        },

        setX: function(_x)
        {
            this.x = _x === undefined ? null : _x;
            return this;
        },

        setY: function(_y)
        {
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setZ: function (_z)
        {
            this.z = _z === undefined ? null : _z;
            return this;
        },

        setVector: function(_vector)
        {
            if (_vector == null) { return null; }
            
            this.x = _vector.x === undefined ? null : _vector.x;
            this.y = _vector.y === undefined ? null : _vector.y;
            this.z = _vector.z === undefined ? null : _vector.z;

            return this;
        },

        clone: function()
        {
            return new cMaths.vector3(this.x, this.y, this.z);
        },

        vector2: function()
        {
            return new cMaths.vector2(this.x, this.y);
        },

        add: function(_vector)
        {
            return _vector == null ? this.clone()
                    : new cMaths.vector3(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z);
        },

        Add: function(_vector)
        {
            if (_vector != null)
            {
                this.x += _vector.x;
                this.y += _vector.y;
                this.z += _vector.z;
            }

            return this;
        },

        subtract: function(_vector)
        {
            return _vector == null ? this.clone()
                    : new cMaths.vector3(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z);
        },

        Subtract: function(_vector)
        {
            if (_vector != null)
            {
                this.x -= _vector.x;
                this.y -= _vector.y;
                this.z -= _vector.z;
            }

            return this;
        },

        scale: function(_scalar)
        {
            return _vector == null ? null
                    : new cMaths.vector3(this.x * _scalar, this.y * _scalar, this.z * _scalar);
        },

        Scale: function(_scalar)
        {
            this.x *= _scalar;
            this.y *= _scalar;
            this.z *= _scalar;

            return this;
        },

        dot: function(_vector)
        {
            return _vector == null ? null
                    : new cMaths.vector3(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z);
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },
    
        distanceSqr: function (_vector) {
            if (_vector == null) { return NaN; }
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            var deltaZ = this.z - _vector.z;
            return (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        }
    }

    this.vector4 = function vector4(_x, _y, _z, _w)
    {
        this.x = _x === undefined ? null : _x;
        this.y = _y === undefined ? null : _y;
        this.z = _z === undefined ? null : _z;
        this.w = _w === undefined ? null : _w;
    }

    this.vector4.prototype = 
    {
        set: function(_x, _y, _z, _w)
        {
            this.x = _x === undefined ? null : _x;
            this.y = _y === undefined ? null : _y;
            this.z = _z === undefined ? null : _z;
            this.w = _w === undefined ? null : _w;
            return true;
        },

        setX: function(_x)
        {
            this.x = _x === undefined ? null : _x;
            return this;
        },

        setY: function(_y)
        {
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setZ: function (_z)
        {
            this.z = _z === undefined ? null : _z;
            return this;
        },

        setW: function (_w)
        {
            this.w = _w === undefined ? null : _w;
            return this;
        },

        setVector: function(_vector)
        {
            if (_vector == null) { return null; }
            
            this.x = _vector.x === undefined ? null : _vector.x;
            this.y = _vector.y === undefined ? null : _vector.y;
            this.z = _vector.z === undefined ? null : _vector.z;
            this.w = _vector.w === undefined ? null : _vector.w;

            return this;
        },

        clone: function()
        {
            return new cMaths.vector4(this.x, this.y, this.z, this.w);
        },

        vector2: function()
        {
            return new cMaths.vector2(this.x, this.y);
        },

        vector3: function()
        {
            return new cMaths.vector3(this.x, this.y, this.z);
        },

        add: function(_vector)
        {
            return _vector == null ? this.clone()
                    : new cMaths.vector4(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z, this.w + _vector.w);
        },

        Add: function(_vector)
        {
            if (_vector != null)
            {
                this.x += _vector.x;
                this.y += _vector.y;
                this.z += _vector.z;
                this.w += _vector.w;
            }

            return this;
        },

        subtract: function(_vector)
        {
            return _vector == null ? this.clone()
                    : new cMaths.vector4(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z, this.w - _vector.w);
        },

        Subtract: function(_vector)
        {
            if (_vector != null)
            {
                this.x -= _vector.x;
                this.y -= _vector.y;
                this.z -= _vector.z;
                this.w -= _vector.w;
            }

            return this;
        },

        scale: function(_scalar)
        {
            return _scalar == null ? null
                    : new cMaths.vector4(this.x * _scalar, this.y * _scalar, this.z * _scalar, this.w * _scalar);
        },

        Scale: function(_scalar)
        {
            this.x *= _scalar;
            this.y *= _scalar;
            this.z *= _scalar;
            this.w *= _scalar;

            return this;
        },

        dot: function(_vector)
        {
            return _vector == null ? null
                    : new cMaths.vector4(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z, this.w * _vector.w);
        },

        Dot: function(_vector)
        {
            if (_vector != null)
            {
                this.x *= _vector.x;
                this.y *= _vector.y;
                this.z *= _vector.z;
                this.w *= _vector.w;
            }

            return this;
        },
    }

    this.bounds = function bounds(_x1, _y1, _x2, _y2, _flippedY)
    {
        this.x1 = _x1 === undefined ? null : _x1;
        this.y1 = _y1 === undefined ? null : _y1;
        this.x2 = _x2 === undefined ? null : _x2;
        this.y2 = _y2 === undefined ? null : _y2;

        //calculate positions and size
        this.updateExtras = function()
        {
            var _this = this;
            function updateSides(lowestX, lowestY, highestX, highestY)
            {
                this.bottomRight = new cMaths.vector2(lowestX, lowestY);
                this.bottomLeft = new cMaths.vector2(highestX, lowestY);
                this.topRight = new cMaths.vector2(highestX, highestY);
                this.topLeft = new cMaths.vector2(lowestX, highestY);
            }

            updateSides(this.x1 < this.x2 ? this.x1 : this.x2,
                        this.y1 < this.y2 ? this.y1 : this.y2,
                        this.x1 < this.x2 ? this.x2 : this.x1,
                        this.y1 < this.y2 ? this.y2 : this.y1);

            this.size = new cMaths.vector2(this.topRight.x - this.topLeft.x, this.topRight.y - this.bottomRight.y);
        }

        this.updateExtras();
    }

    this.bounds.prototype =
    {
        set: function(_x1, _y1, _x2, _y2)
        {
            this.x1 = _x1 === undefined ? null : _x1;
            this.y1 = _y1 === undefined ? null : _y1;
            this.x2 = _x2 === undefined ? null : _x2;
            this.y2 = _y2 === undefined ? null : _y2;
            this.updateExtras();
            return true;
        },

        setX1: function(_x1)
        {
            this.x1 = _x1 === undefined ? null : _x1;
            this.updateExtras();
            return this;
        },

        setY1: function(_y1)
        {
            this.y1 = _y1 === undefined ? null : _y1;
            this.updateExtras();
            return this;
        },

        setX2: function(_x2)
        {
            this.x2 = _x2 === undefined ? null : _x2;
            this.updateExtras();
            return this;
        },

        setY2: function(_y2)
        {
            this.y2 = _y2 === undefined ? null : _y2;
            this.updateExtras();
            return this;
        },

        setBound: function(_bound)
        {
            this.x1 = _x1 === undefined ? null : _x1;
            this.y1 = _y1 === undefined ? null : _y1;
            this.x2 = _x2 === undefined ? null : _x2;
            this.y2 = _y2 === undefined ? null : _y2;
            this.updateExtras();
            return this;
        },

        clone: function()
        {
            return new cMaths.bounds(this.x1, this.y1, this.x2, this.y2);
        },

        add: function(_bounds)
        {
            return _bounds == null ? this.clone()
                        : new cMaths.bounds(this.x1 + _bounds.x1, this.y1 + _bounds.y1, this.x2 + _bounds.x2, this.y2 + _bounds.y2);
        },

        Add: function(_bounds)
        {
            if (_bounds != null)
            {
                this.x1 += _bounds.x1;
                this.y1 += _bounds.y1;
                this.x2 += _bounds.x2;
                this.y2 += _bounds.y2;
                this.updateExtras();
            }

            return this;
        },

        subtract: function(_bounds)
        {
            return _bounds == null ? this.clone()
                        : new cMaths.bounds(this.x1 - _bounds.x1, this.y1 - _bounds.y1, this.x2 - _bounds.x2, this.y2 - _bounds.y2);
        },

        Subtract: function(_bounds)
        {
            if (_bounds != null)
            {
                this.x1 -= _bounds.x1;
                this.y1 -= _bounds.y1;
                this.x2 -= _bounds.x2;
                this.y2 -= _bounds.y2;
                this.updateExtras();
            }

            return this;
        },

        scale: function(_scalar)
        {
            return _scalar == null ? null
                        : new cMaths.bounds(this.x1 * _scalar, this.y1 * _scalar, this.x2 * _scalar, this.y2 * _scalar);
        },

        Scale: function(_scalar)
        {
            if (_scalar != null)
            {
                this.x1 *= _scalar;
                this.y1 *= _scalar;
                this.x2 *= _scalar;
                this.y2 *= _scalar;
                this.updateExtras();
                return this;
            }

            this.set(null, null, null, null);
            this.updateExtras();
            return this;
        },

        dot: function(_bounds)
        {
            return _bounds == null ? null
                        : new cMaths.bounds(this.x1 * _bounds.x, this.y1 * _bounds.y, this.x2 * _bounds.x2, this.y2 * _bounds.y2);
        },

        Dot: function(_bounds)
        {
            if (_bounds != null)
            {
                this.x1 *= _bounds.x1;
                this.y1 *= _bounds.y1;
                this.x2 *= _bounds.x2;
                this.y2 *= _bounds.y2;
                this.updateExtras();
                return this;
            }

            this.set(null, null, null, null);
            this.updateExtras();
            return this;
        },

        fromVector2s: function(_pos1, _pos2)
        {
            return (_pos1 == null || _pos2 == null) ? null
                        : new cMaths.bounds(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromVector4: function(_vector)
        {
            return _vector == null ? null
                        : new cMaths.bounds(_vector.x, _vector.y, _vector.z, _vector.w);
        },

        fromObject: function(_object, _relative, _includeChildren)
        {

            if (_object == null) { return null; }

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

            return new cMaths.bounds(_objectBounds.left,
                                _objectBounds.top,
                                _objectBounds.right,
                                _objectBounds.bottom);
        }
    }

    this.line = function line(_x1, _y1, _x2, _y2)
    {
        this.x1 = _x1 === undefined ? null : _x1;
        this.y1 = _y1 === undefined ? null : _y1;
        this.x2 = _x2 === undefined ? null : _x2;
        this.y2 = _y2 === undefined ? null : _y2;
    }

    this.line.prototype =
    {
        set: function(_x1, _y1, _x2, _y2)
        {
            this.x1 = _x1 === undefined ? null : _x1;
            this.y1 = _y1 === undefined ? null : _y1;
            this.x2 = _x2 === undefined ? null : _x2;
            this.y2 = _y2 === undefined ? null : _y2;
        },

        fromVector2s: function(_pos1, _pos2)
        {
            return (_pos1 == null || _pos2 == null) ? null
                    : new cMaths.line(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromVector4: function(_vector)
        {
            return _vector == null ? null
                        : new cMaths.line(_vector.x, _vector.y, _vector.z, _vector.w);
        },

        distance: function () {
            return Math.sqrt(this.distanceSqr());
        },
    
        distanceSqr: function () {
            if (this.x1 == null || this.x2 == null || this.y1 == null || this.y2 == null) { return NaN; }
            var deltaX = this.x1 - this.x2;
            var deltaY = this.y1 - this.y2;
            return (deltaX * deltaX + deltaY * deltaY);
        }
    }

}

//hold collision/bounds testing functions
function customMathCollisionFunctions()
{

    //return any objects from _objects where object's bounds are within _areaBounds
    this.returnObjectsWithinArea = function(_areaBounds, _objects)
    {
        var _ret = [];

        if (_objects != null && _areaBounds != null)
        {

            for (var i = 0; i < _objects.length; i++)
            {
                //get object's bounds
                var _otherBounds = cMaths.Bounds.fromObject(_objects[i]);

                //check if object bounds is within _areaBounds
                if (this.checkAreaWithinArea(_areaBounds, _otherBounds))
                {
                    _ret.push({ _object: _objects[i], _bounds: _otherBounds });
                }
            }

        }

        return _ret;
    }

    //return any objects from _objects where object's bounds intersect _areaBounds
    this.returnObjectsIntersectArea = function(_areaBounds, _objects)
    {
        var _ret = [];

        if (_areaBounds != null && _objects != null) 
        {

            for (var i = 0; i < _objects.length; i++)
            {
                //get object's bounds
                var _otherBounds = cMaths.Bounds.fromObject(_objects[i]);

                //check if object bounds intersects _areaBounds
                if (this.checkAreaIntersectsArea(_areaBounds, _otherBounds))
                {
                    _ret.push({ _object: _objects[i], _bounds: _otherBounds });
                }
            }

        }

        return _ret;
    }

    //check if a point is within bounds
    this.checkPointWithinArea = function(_areaBounds, _point)
    {
        if (_areaBounds == null || _point == null) { return false; }

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

        if (_areaBounds == null || _otherBounds == null) { return false; }

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

        if (_areaBounds == null || _otherBounds == null) { return false; }

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

        if (_line1 == null || _line2 == null) { return null; }

        var _lineIntersect = new cMaths.vector2(null, null);

        var div = (_line1.x1 - _line1.x2) * (_line2.y1 - _line2.y2)
                - (_line1.y1 - _line1.y2) * (_line2.x1 - _line2.x2);

        _lineIntersect.x = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.x1 - _line2.x2) 
            - (_line1.x1 - _line1.x2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.x /= div;
        
        _lineIntersect.y = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.y1 - _line2.y2) 
            - (_line1.y1 - _line1.y2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.y /= div;

        //check values are valid
        if (isNaN(_lineIntersect.x) || isNaN(_lineIntersect.y)) { return null; }

        return _lineIntersect;
    }
    
}

//Holds math functions
function customMathGenericFunctions()
{

    //check if value between min/max with epsilon accuracy
    this.between = function(_min, _val, _max, _eps)
    {
        if (_min == null || _val == null || _max == null) { return NaN; }
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

        if (_object == null) { return null; }

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

                _objectPosition.Add(cMaths.viewportOffset);
            }

        }

        return _objectPosition;
    }

    this.translateCssSizes = function translateCssSizes(_object, _css, _computedStyle)
    {

        if (_css == null || (_object == null && _computedStyle == null)) { return NaN; }

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
                return NaN;
            default:
                return parseInt(_computedStyle[_css], 10);
        }
    }
}