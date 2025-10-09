export function computeScore(items: any[]): number {
	let score = 0;
	for (let i = 0; i < items.length; i++) {
		const it = items[i];
		if (!it) continue;
		if (it.type === "A") {
			if (it.value > 10) score += it.value * 2;
			else if (it.value > 5) {
				for (let j = 0; j < it.sub?.length ?? 0; j++) {
					const s = it.sub[j];
					score += s?.weight ?? 0;
					if (s && s.flag) {
						score = score + (s.weight * 3 - (s.flag ? 1 : 0));
					}
				}
			} else score += it.value;
		} else if (it.type === "B") {
			score += it.value > 2 ? it.value * 4 : it.value * 0.5;
		} else {
			score = score > 0 ? score - 1 : 0;
		}
	}

	return score > 100 ? 100 : score;
}
