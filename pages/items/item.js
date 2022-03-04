import NextLink from "next/link";

const Item = ({ item }) => {
  return (
    <div className="p-2 divide-y divide-gray-700 rounded dark:bg-gray-800">
      <NextLink href={`/items/${item.id}`} passHref>
        <div className="p-4 overflow-hidden rounded cursor-pointer dark:bg-gray-800 group text-ellipsis">
          <a className="text-3xl dark:group-hover:text-gray-400 ">
            {item.title}
          </a>
        </div>
      </NextLink>

      <ul className="flex flex-wrap items-start justify-start p-4 ">
        {item.tags.map((tag, index) => {
          return (
            <NextLink
              href={`/search/tags?val=${tag.name}`}
              key={tag.id}
              passHref
            >
              <li className="flex items-center justify-center px-3 py-1 mb-2 mr-2 rounded cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-700">
                {tag.name}
              </li>
            </NextLink>
          );
        })}
      </ul>
    </div>
  );
};

export default Item;
