/* GCompris - tangram.js
 *
 * Copyright (C) 2015 YOUR NAME <xx@yy.org>
 *
 * Authors:
 *   <THE GTK VERSION AUTHOR> (GTK+ version)
 *   "YOUR NAME" <YOUR EMAIL> (Qt Quick port)
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
.pragma library
.import QtQuick 2.0 as Quick

var url = "qrc:/gcompris/src/activities/tangram/resource/"


var currentLevel = 0
var items

function start(items_) {
    items = items_
    currentLevel = 0
    initLevel()
}

function stop() {
}

function initLevel() {
    items.bar.level = currentLevel + 1
}

function nextLevel() {
    if(items.numberOfLevel <= ++currentLevel ) {
        currentLevel = 0
    }
    initLevel();
}

function previousLevel() {
    if(--currentLevel < 0) {
        currentLevel = items.numberOfLevel - 1
    }
    initLevel();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Determines the angle of a straight line drawn between point one and two.
// The number returned, which is a float in radian,
// tells us how much we have to rotate a horizontal line clockwise
// for it to match the line between the two points.
function getAngleOfLineBetweenTwoPoints(x1, y1, x2, y2) {
    var xDiff = x2 - x1;
    var yDiff = y2 - y1;
    return Math.atan2(yDiff, xDiff);
}

function getDistance(ix, iy, jx, jy) {
    return Math.sqrt(Math.pow((ix - jx), 2) + Math.pow((iy - jy), 2))
}

function dumpTans(tans) {
    console.log("== tans ==")
    for(var i = 0; i < tans.length; i++) {
        console.log(tans[i].img, tans[i].x, tans[i].y, tans[i].rotation, tans[i].flipping)
    }
}

/* Returns the [x, y] coordinate of the closest point */
function getClosest(point) {
    var nbpiece = items.currentTans.pieces.length
    var closestItem
    var closestDist = 1
    for(var i = 0; i < nbpiece; i++) {
        var p1 = items.currentTans.pieces[i]
        var dist = getDistance(p1.x, p1.y, point[0], point[1])
        if(dist < closestDist) {
            closestDist = dist
            closestItem = p1
        }
    }

    if(closestDist < 0.1)
        return [closestItem.x, closestItem.y]
    return
}

function check() {
    var nbpiece = items.currentTans.pieces.length
    var userTans = items.userList.asTans()
    dumpTans(userTans)
    //console.log('== check ==')
    for(var i = 0; i < nbpiece; i++) {
        var p1 = items.currentTans.pieces[i]
        var ok = false
        console.log("testing " + p1.img)
        for(var j = 0; j < nbpiece; j++) {
            var p2 = userTans[j]
            // Check type distance and rotation are close enough
            console.log("   compare with " + p2.img)
            if(p1.img === p2.img &&
                    p1.flipping == p2.flipping &&
                    getDistance(p1.x, p1.y, p2.x, p2.y) < 0.01 &&
                    p1.rotation === p2.rotation ) {
                ok = true
                console.log("piece ", p1.img, "OK")
                break
            }
            console.log("piece ", p1.img, getDistance(p1.x, p1.y, p2.x, p2.y), 'rot exp/got', p1.rotation, '/', p2.rotation, "NOK")
        }
        if(!ok)
            return false
    }
    return true
}
