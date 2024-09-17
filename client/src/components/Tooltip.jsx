import { useEffect, useState } from "react";
import "./Tooltip.css";

const Tooltip = ({ uniqueKey, itemId, itemData, visibleTooltipId, onTooltipClick }) => {
  const [tooltipContent, setTooltipContent] = useState({ name: "", description: "" });

  useEffect(() => {
    if (itemId && itemData && itemData[itemId]) {
      const item = itemData[itemId];
      setTooltipContent({
        name: item.name || "Unknown Item", // Fetch the item name or use a default value
        description: item.description || "No description available", // Fetch the description
      });
    }
  }, [itemId, itemData]);

  const handleClick = () => {
    onTooltipClick(uniqueKey); // Use the unique key (combination of participant and item) for toggling
  };

  return (
    <div className="tooltip-container">
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${itemId}.png`}
        alt={`Item ${itemId}`}
        className="item-icon"
        onClick={handleClick} // Toggle tooltip on click
      />
      {visibleTooltipId === uniqueKey && tooltipContent.description && (
        <div className="tooltip">
          <p>
            <strong>{tooltipContent.name}</strong> {/* Display the item name */}
          </p>
          <p dangerouslySetInnerHTML={{ __html: tooltipContent.description }}></p> {/* Display the item description */}
        </div>
      )}
    </div>
  );
};

export default Tooltip;