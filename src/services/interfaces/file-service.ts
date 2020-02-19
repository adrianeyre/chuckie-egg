export default interface IFileService {
	readLevel(level: number): Promise<number[][]>;
}