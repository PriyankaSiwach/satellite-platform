import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "@/lib/ddb";
import { Telemetry } from "@/types/telemetry";

const TABLE = process.env.DDB_TELEMETRY_TABLE!;

export async function saveTelemetry(satelliteId: string, t: Telemetry) {
    // Ensure timestamp exists
    const timestamp = t.timestamp ?? new Date().toISOString();

    const { timestamp: _ignore, ...rest } = t;
    const item = {
        satelliteId,
        timestamp,
        ...rest,
    };

    await ddb.send(
        new PutCommand({
            TableName: TABLE,
            Item: item,
        })
    );

    return item;
}

// Later useful: get latest N points
export async function getLatestTelemetry(satelliteId: string, limit = 20) {
    const res = await ddb.send(
        new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: "satelliteId = :sid",
            ExpressionAttributeValues: {
                ":sid": satelliteId,
            },
            ScanIndexForward: false, // newest first (because timestamp sort key)
            Limit: limit,
        })
    );

    return res.Items ?? [];
}