import mongoose from 'mongoose';

export default callback => {
	// connect to a database if needed, then pass it to `callback`:

	/**
	 * mongoDB CONNECTION
	 */
	mongoose.connect('mongodb://localhost/rejsing');

	callback(mongoose);
}
