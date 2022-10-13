import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import "./App.css";

function generateData() {
  let data = [];
  for (let i = 0; i < 75; i = i + 0.02) {
    let x =
      Math.sin(i) *
      (Math.pow(Math.sin(i / 12), 5) + Math.pow(Math.E, Math.cos(i)) - 2 * Math.cos(4 * i));
    // x(t) = sin(t) (sin^5(t/12) + e^cos(t) - 2 cos(4 t))
    let y =
      Math.cos(i) *
      (Math.pow(Math.sin(i / 12), 5) + Math.pow(Math.E, Math.cos(i)) - 2 * Math.cos(4 * i));
    // y(t) = cos(t) (sin^5(t/12) + e^cos(t) - 2 cos(4 t))
    data.push([x * 15, y * 15]);
  }
  return data;
}

function Butterfly() {
  const [data, setData] = useState(generateData);
  const stroke = "#FE8D03";
  const strokeWidth = 0.1;
  const d = d3.line().curve(d3.curveCatmullRom)(data);
  const svgRef = useRef(null);
  const timeoutIDRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;
    let svg = d3.select(svgRef.current);

    let path = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("d", d);

    const length = path.node().getTotalLength();

    function drawPath() {
      path
        .attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .duration(35000)
        .on("end", () => (timeoutIDRef.current = setTimeout(drawPath, 1000)));
      return () => {
        clearTimeout(timeoutIDRef.current);
      };
    }

    drawPath();
  }, [data, d]);

  return (
    <div className='butterfly'>
      <svg
        style={{ rotate: "180deg" }}
        className='butterfly-svg'
        ref={svgRef}
        viewBox='-100 -100 200 200'
      >
        {data.map((point, i) => (
          <circle key={i} cx={point[0]} cy={point[1]} r='0.1' fill='#FE8D03' />
        ))}
      </svg>
    </div>
  );
}

export default Butterfly;
