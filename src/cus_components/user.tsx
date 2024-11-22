import Link from "next/link";

// Components
import { Avatar, AvatarProps } from "antd";

// Types
import { UserIn } from "@/api/auth";
import { FlexDiv } from "@/components/container";

// Tools
import { classNames } from "@/tools/css_tools";
import { setDefault } from "@/tools/set_default";

interface CusAvatarProps extends AvatarProps {
  user: UserIn;
}

/**
 * Component to show a user avatar
 */
export function CusAvatar(props: CusAvatarProps) {
  const { user, ...rest } = props;
  return (
    <Avatar size={"large"} gap={0} {...rest}>
      {user.username.substring(0, 3)}
    </Avatar>
  );
}

interface CusUserBarProps {
  user: UserIn;
  /**
   * Redirect to user profile page when clicked.
   */
  clickable?: boolean;
}

/**
 * Component to show a tiny user bar displaying user name and avatar.
 *
 * Also support clickable which links to user profile.
 */
export function CusUserBar(props: CusUserBarProps) {
  let { user, clickable } = props;
  clickable = setDefault(clickable, true);

  let content = (
    <FlexDiv
      className={classNames(
        "flex-row items-center justify-start gap-2",
        "bg-transparent px-1 py-1",
        clickable ? "rounded-lg hover:bg-bgcolor/50" : "",
      )}
    >
      <CusAvatar user={props.user} size={"small"}></CusAvatar>
      <p className="">{props.user.username}</p>
    </FlexDiv>
  );

  if (clickable) {
    content = <Link href={`/user?id=${user.user_id}`}>{content}</Link>;
  }

  return content;
}
