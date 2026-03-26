import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BucketProgress } from "./BucketProgress";
import { formatBucketType, type Bucket, type BucketType } from "@/data/buckets";

const typeBadgeVariant: Record<BucketType, "default" | "secondary" | "outline"> = {
  project: "default",
  sinking_fund: "secondary",
  savings_goal: "outline",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface BucketCardProps {
  readonly bucket: Bucket;
}

export function BucketCard({ bucket }: BucketCardProps) {
  const hasTarget = bucket.target !== undefined && bucket.target > 0;

  return (
    <Link href={`/buckets/${bucket.id}`} className="block">
      <Card className="transition-shadow hover:ring-foreground/20" size="sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl leading-none shrink-0">
                {bucket.emoji}
              </span>
              <CardTitle className="truncate">{bucket.name}</CardTitle>
            </div>
            <Badge variant={typeBadgeVariant[bucket.type]} className="shrink-0">
              {formatBucketType(bucket.type)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {hasTarget ? (
            <BucketProgress
              current={bucket.current}
              target={bucket.target}
              size="sm"
            />
          ) : (
            <p className="text-sm font-medium tabular-nums">
              {formatCurrency(bucket.current)}{" "}
              <span className="text-text-tertiary font-normal">spent</span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
