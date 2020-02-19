import axios from 'axios';

import IFileService from './interfaces/file-service';

export default class FileService implements IFileService {
	public readLevel = async(level: number): Promise<number[][]> => {
		const response = await axios({
			method: 'get',
			url: `./levels/level${ level.toString().length === 1 ? '0' : ''}${ level }.dat`,
		});

		return response.data;
	}
}
