<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Analysis](#analysis)
    -   [likelihood_analysis](#likelihood_analysis)
-   [Interface](#interface)
    -   [hideshow](#hideshow)
-   [Main](#main)
    -   [initialize](#initialize)
-   [Output](#output)
    -   [skymap](#skymap)
        -   [skymap](#skymap-1)
-   [Processing](#processing)
    -   [customReader](#customreader)
    -   [filter](#filter)
    -   [parseFormat](#parseformat)
    -   [pushFiles](#pushfiles)
        -   [readTextFile](#readtextfile)
-   [Utility](#utility)
    -   [isSelected](#isselected)
    -   [toDegrees](#todegrees)
    -   [toRadians](#toradians)

## Analysis

### likelihood_analysis

Performs likelihood analysis on neutrino events given a set of known gamma-ray sources.

<p> The display is made up of svg objects, on the same layer as the canvas objects making up the skymap. All likelihood-related objects are located below the skymap.
<p> Two graphs are displayed to visually convey the results of the analysis. The following are in-depth explanations of how these graphs are generated, and how to interpret them.
<p> <b> Likelihood Graph: </b> 
<p> This graph displays the TS (test statistic), which is a quantification of the likelihood that ns neutrino events originated from the selected source,  for ns values between 0 and 10. In calculating the TS, spacial clustering of events, as well as their proximty to the source and their associated angular errors are taken into account. Generally, TS ≥ 25 is considered significant.
<p> The following equations are used to compute TS: 
<p> 
<p> where ns = 0 is the null hypothesis that ns neutrino events correlate with the selected gamma-ray source, and is bounded between zero and N. S accounts for the event angular distribution. B is the background distribution which is assumed to be isotropic (1/4pi).N = # of neutrino events; M = # of sources in target catalog
<p> The output to this equation is the calculated probability that exactly ns neutrino events are associated with the target source. 
<p> The angular distribution of events takes the form of a 2-dimensional Kent distribution. This is the standard probability distribution for these events -- centered around the given coordinates, the true location of the source may lie anywhere in the surrounding region. This is why gamma-ray sources even in moderate proximity to neutrino events are of significance. 
<p>
<p> where L is our likelihood definition. Though our definition of TS is somewhat arbitrary, it serves to construct a scale where TS>25 can be considered statistically significant.
<p>
<p> <b> Proximity Visualization: </b>
<p> This graphic displays a 20° Right Ascension x 20° Declination region surrounding the selected gamma-ray source. Neutrino events and their error regions are also displayed. The opacity of error regions at any given point in the graph relays the probability that the true location of an event lies on that point. In this way, the viewer can visualize how the angular distribution of nearby events actually relates to the location of the sources they select. 
<p> As in our calculation of TS, the error regions of neutrino events follow a 2D Kent Distribution.

## Interface

Handles UI elements

### hideshow

Toggles the visibility of various HTML elements

<ul style="list-style: none;">
 <li> time filtering ("times", "set_margin")
 <li> flux filtering ("flux_form")
 <li> spectral index filtering ("spec_form")
</ul>

## Main

### initialize

Begins parsing of data and drawing of skymap <p>
Called on load, as well as on significant changes (making selections, performing analysis, configuring filter parameters)

## Output

### skymap

#### skymap

Defines drawing function and draws the skymap

**Parameters**

-   `stringout` **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** all filtered event data<p> format: (input format later)

## Processing

### customReader

Handles user inputted files

**Parameters**

-   `input` **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

### filter

### parseFormat

Parses files with non-standard organization.

<p> Called by filter.js when reading and filtering files
<p>In order to read custom files, Vetal must determine how the data is organized.
<p>The general acceptable file format consists of a raw text file organized as a spreadsheet w/ headers located on the first line. 
<p>This function finds those headers, and communicates back to the file reader how they are organized:
<p> Vetal format:
<ul style="list-style: none;">
 <li> 1) declination (degrees)
 <li> 2) right ascension (degrees)
 <li> 3) error/angular resolution 
 <li> 4) topology/event signature
 <li> 5) error/angular resolution 
 <li> 6) energy
 <li> 7) date/time
 <li> 8) flux
 <li> 9) spectral index
</ul>

**Parameters**

-   `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the raw text of a data file

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** indices - an array of integers telling how the columns/headers of the file are arranged in comparison to the standard Vetal format. <p> For example, a file organized as {ra, dec} would return [2, 1, null, null....] - the first index holds right ascension which is the second index in the default format, the second index holds dec (1st default format index), and no other data is contained so the remaining indices are null.

### pushFiles

Handles files already in the program

#### readTextFile

Reads a raw text file(s)

## Utility

Handles various misc. utilities

### isSelected

Returns true if file has been selected by the user, false if otherwise

**Parameters**

-   `kind` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** kind/category of file (accepted kinds: 'neutrino', 'gamma-ray', 'source', 'other')
-   `filename` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** given name of file

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### toDegrees

Utility

**Parameters**

-   `angle` **float** in radians

Returns **float** angle in degrees

### toRadians

Utility

**Parameters**

-   `angle` **float** in degrees

Returns **float** angle in radians