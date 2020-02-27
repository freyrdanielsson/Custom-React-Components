import React from "react";
import { motion } from "framer-motion";

import './menuToggleSVG.css';

const Path = props => (
  <motion.path
    initial={false}
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    transition={{duration: 0.2}}
    {...props}
  />
);

/* Don't understand the syntax for svg path?
No worries https://css-tricks.com/svg-path-syntax-illustrated-guide/ 
bkv Freyr */

export const MenuToggle = ({ toggle }) => (
  <button className="svg-button" onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 6 L 20 6" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
      />
      <Path
        variants={{
          closed: { d: "M 2 12.346 L 20 12.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
      />
    </svg>
  </button>
);