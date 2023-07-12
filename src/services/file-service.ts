import IFileService from './interfaces/file-service';

import level01 from '../levels/level01.json'
import level02 from '../levels/level02.json'
import level03 from '../levels/level03.json'
import level04 from '../levels/level04.json'
import level05 from '../levels/level05.json'
import level06 from '../levels/level06.json'
import level07 from '../levels/level07.json'

const levels = {
	1:  level01,
	2:  level02,
	3:  level03,
	4:  level04,
	5:  level05,
	6:  level06,
	7:  level07,
} as any

export default class FileService implements IFileService {
	public readLevel = async(level: number): Promise<number[][]> => {
		if (level < 1 || level > 7) throw new Error('Level out of range');

		return levels[level];
	}
}
