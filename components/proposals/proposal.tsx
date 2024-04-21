import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Progress , Link } from "@nextui-org/react";

export const Proposal = () => {
  const [isFollowed, setIsFollowed] = React.useState(false);
  return (
    <Link href={"/proposal/123"}> 
    <Card className="max-w-max">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src="/avatars/avatar-1.png" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">0xa755...Ca25</h4>
            <h5 className="text-small tracking-tight text-default-400">  Ended 7 days ago</h5>
          </div>
        </div>
        <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Open" : "Closed"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-black">
        <p>
          Proposal to Launch veCAKE Gauges System on Base
          As mentioned in our initial veCAKE proposal, and because the Base folks dared us to, we are excited to share the next veCAKE deployment - Base!
        </p>
        <Progress
          label="Yes"
          size="md"
          value={90}
          maxValue={100}
          color="success"
          showValueLabel={true}
          className="max-w-md"
        />
        <Progress
          label="NO"
          size="md"
          value={10}
          maxValue={100}
          color="danger"
          showValueLabel={true}
          className="max-w-md"
        />

      </CardBody>
      <CardFooter className="gap-3">

      </CardFooter>
    </Card>
    </Link>
  );
};
