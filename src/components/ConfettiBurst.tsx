import React from 'react';

interface ConfettiBurstProps {
	onDone?: () => void;
	count?: number;
	durationMs?: number;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
    onDone,
    count = 140,
    durationMs = 3000,
}) => {
	React.useEffect(() => {
		const timer = setTimeout(() => onDone?.(), durationMs + 200);
		return () => clearTimeout(timer);
	}, [onDone, durationMs]);

	const colors = [
		'hsl(213 100% 56%)',
		'hsl(262 89% 72%)',
		'hsl(45 100% 51%)',
		'hsl(330 85% 65%)',
	];

    const particles = React.useMemo(() => {
        const base = durationMs; // scale particle times to requested duration
        return Array.from({ length: count }).map(() => ({
            leftPercent: Math.random() * 100,
            rotateDeg: Math.random() * 360,
            dxVw: (Math.random() * 40 - 20).toFixed(2) + 'vw',
            sizePx: Math.floor(6 + Math.random() * 6) + 'px',
            bg: colors[Math.floor(Math.random() * colors.length)],
            duration: Math.floor(base * (0.7 + Math.random() * 0.5)) + 'ms',
            delay: Math.floor(Math.random() * Math.max(150, base * 0.12)) + 'ms',
        }));
    }, [count, durationMs]);

	return (
		<div className="confetti-container">
			{particles.map((p, idx) => (
				<span
					key={idx}
					className="confetti-particle"
					style={{
						left: p.leftPercent + '%',
						['--dx' as any]: p.dxVw,
						['--rot' as any]: p.rotateDeg + 'deg',
						['--size' as any]: p.sizePx,
						['--dur' as any]: p.duration,
						animationDelay: p.delay,
						background: p.bg,
					}}
				/>
			))}
		</div>
	);
};

export default ConfettiBurst;


