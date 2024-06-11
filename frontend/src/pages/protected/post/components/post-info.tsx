interface IPostInfoProps {
   username: string | undefined
   body: string | undefined
   className: string
}
const PostInfo: React.FC<IPostInfoProps> = ({ username, body, className }) => (
   <p className={`${className} font-semibold italic leading-none`}>
      {username} <span className="ml-1 font-normal not-italic leading-none tracking-tighter">{body}</span>
   </p>
)

export default PostInfo
