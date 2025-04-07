import { connectToMongoDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PATCH(req: NextRequest) {
	try {
		const { id, status } = await req.json();
        console.log('Trying to update ID:', id, 'to status:', status);


		if (!id || !status) {
			return NextResponse.json({ message: 'ID and status are required.' }, { status: 400 });
		}

		const { db } = await connectToMongoDB();
		const newsletters = db.collection('newsletter');

		const result = await newsletters.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { status: status } }
		);

		if (result.modifiedCount === 0) {
			return NextResponse.json({ message: 'No document updated.' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Status updated successfully.' });
	} catch (error) {
		console.error('Error updating status:', error);
		return NextResponse.json({ message: 'Server error', error: String(error) }, { status: 500 });
	}
}
