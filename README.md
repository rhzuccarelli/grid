# Product Grid & Proportion Analyzer

A browser-based tool for studying the geometry, proportions, dimensions, and feature placement of products from photographs. It runs entirely in the browser and uses a single HTML file, so no build step or server-side processing is required.

## Image input and preparation

- Load common image formats with the file picker.
- Paste an image directly from the clipboard with `Ctrl+V` or `Cmd+V`.
- Load the included demonstration product to explore the controls.
- Straighten a tilted photograph from −15° to +15°, using the slider or 0.1° nudge buttons.

Straighten or correct the photograph before placing product limits, landmarks, measurements, or calibration references. Changing the image geometry resets those annotations so they cannot silently become inaccurate.

## Perspective correction

The four-point perspective tool rectifies a photographed planar surface. Select its corners clockwise in this order:

1. Top-left
2. Top-right
3. Bottom-right
4. Bottom-left

The corrected output can use one of three target proportions:

- **Square:** forces the selected area to 1:1. Use this when the reference is known to be square.
- **Measured ratio:** estimates the target ratio from the selected quadrilateral.
- **Custom W:H:** uses a manually entered width-to-height ratio for a known rectangular object.

The correction can be undone. It is intended for perspective or keystone distortion, where a rectangle appears trapezoidal because the camera is not parallel to it.

> Four corners cannot fully correct barrel or pincushion lens distortion. Radial lens correction requires several points along multiple known-straight lines—or a calibration photograph of a regular grid—because the amount of curvature changes across the image.

## Product limits and fine adjustment

Define the product with four orthogonal limits in this order: left, right, top, and bottom. The resulting rectangle drives the proportion, grid, and real-dimension calculations.

After placing the limits, select any edge and nudge it by 0.1, 0.5, or 1 pixel. Arrow keys adjust the selected edge; holding `Shift` uses a 0.1-pixel step.

## Square grid and proportion analysis

Generate a square-cell grid using any of these inputs:

- Number of columns
- Number of rows
- Cell size in pixels

The grid can be limited to the product or extended across the full photograph. Its opacity is adjustable, and optional center axes identify the horizontal and vertical midpoint.

The analysis reports:

- Product width and height in pixels
- Width-to-height and height-to-width ratios
- A nearby fractional ratio
- The nearest familiar proportion, such as 1:1, 4:3, 3:2, 16:9, √2, or the golden ratio
- Grid columns, rows, and square-cell size
- Real product dimensions when a physical scale is available

## Real-dimension calibration

There are two calibration methods.

### Known product side

Enter the real width or height of the product. The tool derives millimetres per pixel, the other product dimension, and the real square-grid cell size.

### Ruler or known reference

Use **Scale reference** to click two known marks on a ruler or another object of known size, then enter their separation in millimetres. This method is useful when neither product dimension is known.

Reference-line calibration takes priority while it is active. Clearing the reference returns the analysis to known-product-side calibration.

For reliable measurements, the ruler and product should lie in the same physical plane. A ruler closer to or farther from the camera will introduce perspective-related scale error.

## Landmarks

Place numbered landmarks on feature centers, seams, display edges, controls, or other design details. Each landmark reports:

- Normalized horizontal and vertical position within the product
- Approximate fractional position
- Distance from the product's left and top edges when calibrated

Optional X and Y axes can be projected through each landmark.

## Measurements

Measure the distance between any two points. Endpoints may snap to square-grid intersections. Results include:

- Total distance
- Horizontal and vertical components
- Pixels when uncalibrated
- Millimetres when either calibration method is active

## Reports and PNG output

- Export an ISO B5 analysis sheet suitable for printing or saving as PDF.
- Export an annotated PNG with the grid, limits, landmarks, measurements, and embedded analysis data.
- Copy the annotated PNG directly to the clipboard when the browser permits image clipboard access.

Clipboard writing requires a secure context such as HTTPS or localhost. If permission is unavailable, use the PNG download instead.

## Sidebar

The sidebar is divided into collapsible sections. Use the section titles to open or close individual tool groups, or use **Expand all** and **Collapse all**.

## Running locally

Open `index.html` directly in a modern browser. For full clipboard support, serve the folder on localhost, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
