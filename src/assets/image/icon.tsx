interface IIconProps {
	fill: string;
}

export function IconRemove({ fill }: IIconProps) {
	return (
		<svg
			width='30'
			height='30'
			viewBox='0 0 30 30'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path d='M19 9H23V27H19V9Z' fill={fill} />
			<path d='M12.8462 9H16.8462V27H12.8462V9Z' fill={fill} />
			<path d='M7 9H11V27H7V9Z' fill={fill} />
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M25 8L5 8L5 6L25 6L25 8Z'
				fill={fill}
			/>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M19 5H11V3H19V5Z'
				fill={fill}
			/>
		</svg>
	);
}
