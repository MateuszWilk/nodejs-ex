import restfulMongoose from 'restful-mongoose';

// any mongoose Model:
import boat from '../models/boat'

// create and export a Router, mount it anywhere via .use()
export default restfulMongoose('boat', boat);