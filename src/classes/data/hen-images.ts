import DirectionEnum from '../enums/direction-enum';

import henRightStood from '../../images/hen-right-stood.png';
import henRight from '../../images/hen-right.png';
import henLeftStood from '../../images/hen-left-stood.png';
import henLeft from '../../images/hen-left.png';
import henUp1 from '../../images/hen-up-1.png';
import henUp2 from '../../images/hen-up-2.png';

const henImages = {
	[DirectionEnum.STAND]: [henRightStood],
	[DirectionEnum.UP]: [henUp1, henUp2],
	[DirectionEnum.RIGHT]: [henRightStood, henRight],
	[DirectionEnum.DOWN]: [henUp1, henUp2],
	[DirectionEnum.LEFT]: [henLeftStood, henLeft],
}

export default henImages;