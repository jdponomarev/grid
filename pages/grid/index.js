import { useState, useEffect, useRef } from "react";
import styles from "./Grid.module.css";
import { Slider, Button } from "antd";
import styled from "styled-components";
import { RedoOutlined } from "@ant-design/icons";
import { BlockPicker } from "react-color";

const GridItem = styled.div`
	width: ${(props) => 1000 / props.size}px;
	height: ${(props) => 1000 / props.size}px;
	font-size: ${(props) => 500 / props.size}px;
`;

export default function Grid() {
	const findHoveredElements = function (_grid, rowId, colId) {
		let tmpGrid = _grid.map(function (arr) {
			return arr.slice();
		});
		if (tmpGrid[rowId] && !tmpGrid[rowId][colId]) {
			return [];
		}
		let stack = [[rowId, colId]];
		let hoveredElements = [];
		while (stack.length) {
			const cell = stack.pop();
			const [row, col] = cell;

			hoveredElements.push([row, col]);
			tmpGrid[row][col] = 2;

			if (tmpGrid[row + 1] && tmpGrid[row + 1][col] == 1) {
				tmpGrid[row + 1][col] = 2;
				stack.push([row + 1, col]);
			}
			if (tmpGrid[row] && tmpGrid[row][col + 1] == 1) {
				tmpGrid[row][col + 1] = 2;
				stack.push([row, col + 1]);
			}
			if (tmpGrid[row - 1] && tmpGrid[row - 1][col] == 1) {
				tmpGrid[row - 1][col] = 2;
				stack.push([row - 1, col]);
			}
			if (tmpGrid[row] && tmpGrid[row][col - 1] == 1) {
				tmpGrid[row][col - 1] = 2;
				stack.push([row, col - 1]);
			}
		}
		return hoveredElements;
	};
	const createGrid = function (size) {
		let grid = [];
		for (let rowId = 0; rowId < size; rowId++) {
			let row = [];
			for (let colId = 0; colId < size; colId++) {
				if (Math.random() > 0.3) {
					row.push(0);
				} else {
					row.push(1);
				}
			}
			grid.push(row);
		}
		return grid;
	};

	const [size, setSize] = useState(5);
	const [grid, setGrid] = useState([]);
	const [hoveredElements, setHoverElements] = useState([]);
	const [clickedElement, setClickedElement] = useState([]);
	const [adjacentElementsNumber, setAdjacentElementsNumber] = useState(0);
	const [hoveredColorpickerOpened, setHoveredColorpickerOpened] = useState(
		false
	);
    const [activeColorpickerOpened, setActiveColorpickerOpened] = useState(
		false
	);
    const [activeColor, setActiveColor] = useState("#f5222d")
    const [hoverColor, setHoverColor] = useState("#bae637")
    const activeColorPickerRef = useRef(null)
    const hoverColorPickerRef = useRef(null)

	useEffect(() => {
		setGrid(createGrid(5));
        const handleClickOutside = function(event){
            if (activeColorPickerRef.current && !activeColorPickerRef.current.contains(event.target)) {
                setActiveColorpickerOpened(false)
            }
            if (hoverColorPickerRef.current && !hoverColorPickerRef.current.contains(event.target)) {
                setHoveredColorpickerOpened(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside)
        }
	}, []);

	if (!grid || !grid.length) {
		return null;
	}
	return (
		<div className={styles["grid"]}>
			<div className={styles["grid__content"]}>
				<h1>Hey I'm a grid</h1>
				<div className={styles["grid__controls"]}>
					<div className={styles["grid__controls__size"]}>
						<p>Grid size:</p>
						<Slider
							min={2}
							max={50}
							defaultValue={5}
							onChange={(value) => {
								setSize(value);
								setGrid(createGrid(value));
								setClickedElement(0);
							}}
						/>
					</div>
					<div
						className={
							styles["grid__controls__colorpicker_container"]
						}
                        ref={activeColorPickerRef}
					>
						<Button
							onClick={() => {
                                setHoveredColorpickerOpened(false)
								setActiveColorpickerOpened(
									!activeColorpickerOpened
								);
							}}
						>
							Select active color
						</Button>
						{activeColorpickerOpened ? (
							<div
								className={
									styles[
										"grid__controls__colorpicker_wrapper"
									]
								}
							>
								<BlockPicker
                                    onChange={(value)=>{
                                        setActiveColor(value.hex)
                                    }}
                                    color={activeColor}
									styles={{ position: "absolute" }}
								></BlockPicker>
							</div>
						) : null}
					</div>
                    <div
						className={
							styles["grid__controls__colorpicker_container"]
						}
                        ref={hoverColorPickerRef}
					>
						<Button
							onClick={() => {
                                setActiveColorpickerOpened(false)
								setHoveredColorpickerOpened(
									!hoveredColorpickerOpened
								);
							}}
						>
							Select hover color
						</Button>
						{hoveredColorpickerOpened ? (
							<div
								className={
									styles[
										"grid__controls__colorpicker_wrapper"
									]
								}
							>
								<BlockPicker
                                    onChange={(value) => {
                                        setHoverColor(value.hex)
                                    }}
                                    color={hoverColor}
									styles={{ position: "absolute" }}
								></BlockPicker>
							</div>
						) : null}
					</div>
					<Button
						className={styles["grid__controls__button"]}
						onClick={() => {
							setGrid(createGrid(size));
							setClickedElement(0);
						}}
						type="primary"
						icon={<RedoOutlined />}
					>
						Refresh
					</Button>
				</div>

				<div className={styles["grid__container"]}>
					{grid.map((row, rowId) => {
						return row.map((cell, colId) => {
							let isHovered =
								hoveredElements.find((el) => {
									return el[0] == rowId && el[1] == colId;
								}) ?? false;
							let isClicked =
								clickedElement &&
								clickedElement.length &&
								clickedElement[0] == rowId &&
								clickedElement[1] == colId
									? true
									: false;

                            let cellColor = "#ffffff";
                            if(isHovered){
                                cellColor = hoverColor;
                            }else if(grid[rowId][colId]){
                                cellColor = activeColor;
                            }
							return (
								<GridItem
									key={size + "-" + rowId + "-" + colId}
									size={size}
									onMouseEnter={() => {
										setHoverElements(
											findHoveredElements(
												grid,
												rowId,
												colId
											)
										);
									}}
									onMouseLeave={() => {
										setHoverElements([]);
									}}
									onClick={() => {
										if (grid[rowId] && grid[rowId][colId]) {
											setClickedElement([rowId, colId]);
											setAdjacentElementsNumber(
												findHoveredElements(
													grid,
													rowId,
													colId
												).length
											);
										}
									}}
                                    style={{
                                        backgroundColor: cellColor
                                    }}
									className={`${styles["grid__cell"]}`}
                                    
								>
									{isClicked ? (
										<>{adjacentElementsNumber}</>
									) : null}
								</GridItem>
							);
						});
					})}
				</div>
			</div>
		</div>
	);
}
