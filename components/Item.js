import NextLink from "next/link";

const Item = ({ item }) => {
  return (
    <div className="p-2 divide-y rounded bg-zinc-100 divide-zinc-300 dark:divide-zinc-700 dark:bg-zinc-800">
      <NextLink href={`/items/${item.id}`} passHref>
        <div className="p-4 overflow-hidden rounded cursor-pointer dark:bg-zinc-800 group text-ellipsis ">
          <a className="text-3xl transition ease-in-out group-hover:text-blue-400 dark:group-hover:text-blue-400">
            {item.title}
          </a>
        </div>
      </NextLink>

      <ul className="relative flex flex-wrap items-center justify-start p-4 ">
        {item.tags.slice(0, 7).map((tag, index) => {
          return (
            <li key={tag.id} className="mb-2 mr-2">
              <NextLink
                href={`/search/tags?val=${tag.name}`}
                key={tag.id}
                passHref
              >
                <p
                  className={`flex items-center justify-center px-3 py-1 rounded-md cursor-pointer transition ease-in-out bg-zinc-200 hover:bg-zinc-300  dark:bg-zinc-600 dark:hover:bg-zinc-700 ${
                    index + 1 > 6 && "hidden"
                  }`}
                >
                  {tag.name}
                </p>
              </NextLink>
              {index === 6 && (
                <NextLink href={`/items/${item.id}`} key={item.id} passHref>
                  <div className="flex items-center px-2 py-1 transition ease-in-out rounded-md hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">
                    <p className="text-xs dark:text-zinc-300">See all tags</p>
                  </div>
                </NextLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Item;
