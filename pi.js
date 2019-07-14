
!function() {

    let height = 500,
        width = 500 * 2,
        margin = 30;
    d3.select("#number-of-sectors").append("svg")
        .attr("class", "axis")
        .attr("width", width)
        .attr("height", height)
        .style('border', '1px solid #d2d2d2');
    let randomColor = function () {
        let golden_ratio_conjugate = 0.618033988749895;
        let h = Math.random();
        let hslToRgb = function (h, s, l) {
            let r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
        };
        return function () {
            h += golden_ratio_conjugate;
            h %= 1;
            return hslToRgb(h, 0.5, 0.60);
        };
    };
    let drawCircles = function (counter, radius, svg) {
        let angle = 360 / counter,
            half_angle = angle / 2,
            len_horda = 2 * radius * Math.sin(half_angle * Math.PI / 180),
            width = svg.style("width").replace("px", ""),
            height = svg.style("height").replace("px", "");
        heigh_triangle_sector = Math.sqrt(radius * radius - Math.pow(len_horda / 2, 2));

        let arcA = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(radius)
            .startAngle(-half_angle * Math.PI / 180)
            .endAngle(half_angle * Math.PI / 180);
        let arcB = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(radius)
            .startAngle(Math.PI - half_angle * Math.PI / 180)
            .endAngle(Math.PI + half_angle * Math.PI / 180);
        let start = width / 4 - radius;
        for (let i = 0; i < counter; i++) {
            let arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius)
                .startAngle(i * angle * Math.PI / 180)
                .endAngle((i + 1) * angle * Math.PI / 180);
            svg.append('path')
                .attr('d', arc)
                .attr('transform', 'translate(' + (width / 4 * 3) + ',' + (height / 2) + ')')
                .attr('fill', randomColor())
                .attr("class", "arc");
            if (i % 2 == 1) {
                svg.append('path')
                    .attr('d', arcA)
                    .attr('transform', 'translate(' + (start + (i + 1) * len_horda / 2) + ',' + (height / 2) + ')')
                    .attr('fill', randomColor())
                    .attr("class", "arc");
            } else {
                svg.append('path')
                    .attr('d', arcB)
                    .attr('transform', 'translate(' + (start + (i + 1) * len_horda / 2) + ',' + (height / 2 - radius + (radius - heigh_triangle_sector)) + ')')
                    .attr('fill', randomColor())
                    .attr("class", "arc");
            }
        }
    };
    let clearArc = function (svg) {
        svg.selectAll(".arc").remove();
    };
    let clearDrawSectors = function (rangeSliderSector) {
        let rangeSectorText = document.getElementById('out-half-number-of-sectors');
        rangeSectorText.innerHTML = rangeSliderSector.value;
        let bulletPosition = (rangeSliderSector.value / rangeSliderSector.max);
        let scrollWidth = rangeSliderSector.scrollWidth - 32;
        rangeSectorText.style.left = (bulletPosition * scrollWidth) + "px";

        let svg = d3.select(".axis"),
            radius = Math.min(width - 2 * margin, height - 2 * margin) / 4;
        clearArc(svg);
        drawCircles(rangeSliderSector.value, radius, svg);
    };
    let input_counter = document.getElementById('half-number-of-sectors');
    drawSectors = function (event) {
        let counter = event.target;
        clearDrawSectors(counter);
    };
    let FirstDrawSectors = function () {
        let rangeSliderSector = document.getElementById('half-number-of-sectors');
        clearDrawSectors(rangeSliderSector);
    };
    FirstDrawSectors();
    input_counter.oninput = drawSectors;
}();