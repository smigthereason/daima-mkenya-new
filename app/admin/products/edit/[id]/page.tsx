// app/admin/products/edit/[id]/page.tsx

import { serverClient } from "@/sanity/lib/server-client";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import ColorPickerField from "../../components/ColorPickerField";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ProductGender =
  | "men"
  | "women"
  | "unisex"
  | "kids";

interface EditProduct {
  _id: string;

  name: string;

  slug?: string;

  price?: string;

  gender?: ProductGender;

  categories?: string[];

  description?: string[];

  details?: {
    material?: string;
    care?: string;
    origin?: string;
  };

  stock?: number;

  isNew?: boolean;

  disabled?: boolean;

  sizes?: string[];

  colors?: Array<{
    label?: string;
    hex?: string;
  }>;

  heroImage?: string;

  thumbnails?: string[];
}

/* ==========================================================================
   OPTIONS
   ========================================================================== */

const CATEGORY_OPTIONS = [
  "Accessories",
  "Streetwear",
  "Sets",
  "Shirts",
  "Tops",
  "Skirts",
  "Dresses",
  "Jackets",
  "Trousers",
  "Knitwear",
  "Pants",
] as const;

const GENDER_OPTIONS: {
  label: string;
  value: ProductGender;
  description: string;
}[] = [
  {
    label: "Men",
    value: "men",
    description:
      "Displayed in the men's collection.",
  },

  {
    label: "Women",
    value: "women",
    description:
      "Displayed in the women's collection.",
  },

  {
    label: "Unisex",
    value: "unisex",
    description:
      "Displayed in both men's and women's collections.",
  },

  {
    label: "Kids",
    value: "kids",
    description:
      "Displayed in the kids collection.",
  },
];

/* ==========================================================================
   UPDATE PRODUCT ACTION
   ========================================================================== */

async function updateProduct(
  formData: FormData,
) {
  "use server";

  /* ------------------------------------------------------------------------
     CORE FIELDS
     ------------------------------------------------------------------------ */

  const id =
    formData.get("id") as string;

  const name =
    formData.get("name") as string;

  const slugInput =
    formData.get("slug") as string;

  const price =
    formData.get("price") as string;

  if (!id) {
    throw new Error(
      "Product ID is missing.",
    );
  }

  if (!name?.trim()) {
    throw new Error(
      "Product name is required.",
    );
  }

  /* ------------------------------------------------------------------------
     SLUG
     ------------------------------------------------------------------------ */

  const slug =
    slugInput?.trim()
      ? slugInput
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/gi, "")
          .replace(/\s+/g, "-")
          .substring(0, 200)
      : name
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/gi, "")
          .replace(/\s+/g, "-")
          .substring(0, 200);

  /* ------------------------------------------------------------------------
     GENDER / AUDIENCE
     ------------------------------------------------------------------------ */

  const genderRaw =
    formData.get("gender");

  const allowedGenders: ProductGender[] =
    [
      "men",
      "women",
      "unisex",
      "kids",
    ];

  if (
    typeof genderRaw !== "string" ||
    !allowedGenders.includes(
      genderRaw as ProductGender,
    )
  ) {
    throw new Error(
      "Please select a valid gender / audience.",
    );
  }

  const gender =
    genderRaw as ProductGender;

  /* ------------------------------------------------------------------------
     CATEGORIES
     ------------------------------------------------------------------------ */

  const categories =
    formData
      .getAll("categories")
      .filter(
        (
          category,
        ): category is string =>
          typeof category ===
            "string" &&
          category.trim() !== "",
      );

  if (
    categories.length === 0
  ) {
    throw new Error(
      "Please select at least one category.",
    );
  }

  /* ------------------------------------------------------------------------
     DESCRIPTION
     ------------------------------------------------------------------------ */

  const descriptionRaw =
    formData.get(
      "description",
    );

  const descriptionArray =
    typeof descriptionRaw === "string"
      ? descriptionRaw
          .split("\n")
          .map((line) =>
            line.trim(),
          )
          .filter(Boolean)
      : [];

  /* ------------------------------------------------------------------------
     PRODUCT DETAILS
     ------------------------------------------------------------------------ */

  const material =
    formData.get("material");

  const care =
    formData.get("care");

  const origin =
    formData.get("origin");

  /* ------------------------------------------------------------------------
     COLORS
     ------------------------------------------------------------------------ */

  const colorLabels =
    formData.getAll(
      "colorLabel",
    ) as string[];

  const colorHexes =
    formData.getAll(
      "colorHex",
    ) as string[];

  const colors =
    colorLabels
      .map(
        (
          label,
          index,
        ) => ({
          label:
            label.trim(),

          hex:
            colorHexes[index] ||
            "#000000",
        }),
      )
      .filter(
        (color) =>
          color.label !== "",
      );

  /* ------------------------------------------------------------------------
     SIZES
     ------------------------------------------------------------------------ */

  const sizesRaw =
    formData.get("sizes");

  const sizesArray =
    typeof sizesRaw === "string"
      ? sizesRaw
          .split(",")
          .map((size) =>
            size.trim(),
          )
          .filter(Boolean)
      : [];

  /* ------------------------------------------------------------------------
     STOCK + STATUS
     ------------------------------------------------------------------------ */

  const stock =
    Number(
      formData.get("stock"),
    ) || 0;

  const isNew =
    formData.get("isNew") ===
    "on";

  const disabled =
    formData.get(
      "disabled",
    ) === "on";

  /* ------------------------------------------------------------------------
     HERO IMAGE
     ------------------------------------------------------------------------ */

  const heroImageFile =
    formData.get(
      "heroImage",
    ) as File;

  let heroImageAsset;

  if (
    heroImageFile &&
    heroImageFile.size > 0
  ) {
    heroImageAsset =
      await serverClient.assets.upload(
        "image",
        heroImageFile,
      );
  }

  /* ------------------------------------------------------------------------
     THUMBNAILS
     ------------------------------------------------------------------------ */

  const uploadedThumbnails: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
  }[] = [];

  for (
    let index = 1;
    index <= 4;
    index++
  ) {
    const thumbnailFile =
      formData.get(
        `thumb${index}`,
      ) as File;

    if (
      thumbnailFile &&
      thumbnailFile.size > 0
    ) {
      const asset =
        await serverClient.assets.upload(
          "image",
          thumbnailFile,
        );

      uploadedThumbnails.push({
        _type: "image",

        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      });
    }
  }

  /* ------------------------------------------------------------------------
     BUILD PATCH
     ------------------------------------------------------------------------ */

  const patchData: Record<
    string,
    unknown
  > = {
    name,

    slug: {
      _type: "slug",
      current: slug,
    },

    price,

    gender,

    categories,

    description:
      descriptionArray,

    details: {
      material:
        typeof material ===
        "string"
          ? material
          : "",

      care:
        typeof care ===
        "string"
          ? care
          : "",

      origin:
        typeof origin ===
        "string"
          ? origin
          : "",
    },

    colors,

    sizes:
      sizesArray,

    stock,

    isNew,

    disabled,
  };

  /* ------------------------------------------------------------------------
     ONLY REPLACE IMAGES WHEN NEW ONES ARE UPLOADED
     ------------------------------------------------------------------------ */

  if (
    heroImageAsset
  ) {
    patchData[
      "images.hero"
    ] = {
      _type: "image",

      asset: {
        _type:
          "reference",

        _ref:
          heroImageAsset._id,
      },
    };
  }

  if (
    uploadedThumbnails.length >
    0
  ) {
    patchData[
      "images.thumbnails"
    ] =
      uploadedThumbnails;
  }

  /* ------------------------------------------------------------------------
     UPDATE SANITY
     ------------------------------------------------------------------------ */

  let patch =
    serverClient.patch(id);

  const standardFields = {
    name:
      patchData.name,

    slug:
      patchData.slug,

    price:
      patchData.price,

    gender:
      patchData.gender,

    categories:
      patchData.categories,

    description:
      patchData.description,

    details:
      patchData.details,

    colors:
      patchData.colors,

    sizes:
      patchData.sizes,

    stock:
      patchData.stock,

    isNew:
      patchData.isNew,

    disabled:
      patchData.disabled,
  };

  patch =
    patch.set(
      standardFields,
    );

  if (
    heroImageAsset
  ) {
    patch =
      patch.set({
        "images.hero": {
          _type: "image",

          asset: {
            _type:
              "reference",

            _ref:
              heroImageAsset._id,
          },
        },
      });
  }

  if (
    uploadedThumbnails.length >
    0
  ) {
    patch =
      patch.set({
        "images.thumbnails":
          uploadedThumbnails,
      });
  }

  await patch.commit();

  /* ------------------------------------------------------------------------
     REVALIDATION
     ------------------------------------------------------------------------ */

  revalidatePath(
    "/admin/products",
  );

  revalidatePath(
    `/products/${slug}`,
  );

  revalidatePath(
    "/men",
  );

  revalidatePath(
    "/women",
  );

  revalidatePath(
    "/new-arrivals",
  );

  redirect(
    "/admin/products?status=updated",
  );
}

/* ==========================================================================
   EDIT PRODUCT PAGE
   ========================================================================== */

export default async function EditProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    id,
  } = await params;

  /* ------------------------------------------------------------------------
     FETCH PRODUCT
     ------------------------------------------------------------------------ */

  const product =
    await serverClient.fetch<EditProduct | null>(
      `
      *[
        _type == "product" &&
        _id == $id
      ][0] {
        _id,

        name,

        "slug": slug.current,

        price,

        gender,

        categories,

        description,

        details {
          material,
          care,
          origin
        },

        stock,

        isNew,

        disabled,

        sizes,

        colors[] {
          label,
          hex
        },

        "heroImage":
          images.hero.asset->url,

        "thumbnails":
          images.thumbnails[].asset->url
      }
      `,
      {
        id,
      },
    );

  if (!product) {
    notFound();
  }

  /* ------------------------------------------------------------------------
     FORM HELPERS
     ------------------------------------------------------------------------ */

  const inputClasses =
    "w-full p-4 border border-neutral-200 bg-white text-sm focus:border-black outline-none transition-colors";

  const labelClasses =
    "text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-2";

  const descriptionText =
    Array.isArray(
      product.description,
    )
      ? product.description.join(
          "\n",
        )
      : "";

  const sizesText =
    Array.isArray(
      product.sizes,
    )
      ? product.sizes.join(
          ", ",
        )
      : "";

  /* ==========================================================================
     UI
     ========================================================================== */

  return (
    <div
      className="
        max-w-5xl
        mx-auto
        px-4
        md:px-0
        animate-fadeIn
      "
    >
      {/* ================================================================
          BACK
      ================================================================= */}

      <div
        className="
          mb-8
          flex
          items-center
          gap-4
        "
      >
        <Link
          href="/admin/products"
          className="
            group
            flex
            items-center
            gap-2

            text-neutral-400
            hover:text-black

            transition-colors
          "
        >
          <ArrowLeft
            size={16}
          />

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-widest
            "
          >
            Back to Products
          </span>
        </Link>
      </div>

      {/* ================================================================
          HEADER
      ================================================================= */}

      <div
        className="
          mb-12
          border-b
          border-neutral-100
          pb-10
        "
      >
        <h1
          className="
            text-4xl
            md:text-5xl
            font-light
            tracking-tighter
            uppercase
            leading-[0.9]
          "
        >
          Edit{" "}

          <span className="font-black">
            Product
          </span>
        </h1>

        <p
          className="
            text-[10px]
            md:text-[11px]
            text-neutral-400
            uppercase
            tracking-widest
            font-medium
            mt-2
          "
        >
          ID:{" "}
          {product._id}
        </p>
      </div>

      {/* ================================================================
          CURRENT IMAGES
      ================================================================= */}

      {(product.heroImage ||
        (product.thumbnails &&
          product.thumbnails
            .length > 0)) && (
        <div
          className="
            mb-8
            p-6
            bg-neutral-50
            border
            border-neutral-100
          "
        >
          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-widest
              text-neutral-400
              mb-4
            "
          >
            Current Product Images
          </p>

          <div
            className="
              flex
              flex-wrap
              gap-4
            "
          >
            {product.heroImage && (
              <div>
                <p
                  className="
                    text-[8px]
                    uppercase
                    font-black
                    tracking-widest
                    text-neutral-400
                    mb-2
                  "
                >
                  Hero
                </p>

                <div
                  className="
                    relative
                    h-40
                    w-40

                    bg-white

                    border
                    border-neutral-200

                    overflow-hidden
                  "
                >
                  <Image
                    src={
                      product.heroImage
                    }
                    alt={
                      product.name
                    }
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>
            )}

            {product.thumbnails?.map(
              (
                thumbnail,
                index,
              ) => (
                <div
                  key={
                    thumbnail
                  }
                >
                  <p
                    className="
                      text-[8px]
                      uppercase
                      font-black
                      tracking-widest
                      text-neutral-400
                      mb-2
                    "
                  >
                    Thumbnail{" "}
                    {index + 1}
                  </p>

                  <div
                    className="
                      relative
                      h-28
                      w-28

                      bg-white

                      border
                      border-neutral-200

                      overflow-hidden
                    "
                  >
                    <Image
                      src={
                        thumbnail
                      }
                      alt={`${product.name} thumbnail ${
                        index + 1
                      }`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* ================================================================
          FORM
      ================================================================= */}

      <form
        action={
          updateProduct
        }
        className="
          bg-white

          p-8
          md:p-12

          border
          border-neutral-100

          space-y-10
        "
      >
        <input
          type="hidden"
          name="id"
          value={
            product._id
          }
        />

        {/* ==============================================================
            NAME + SLUG
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
          "
        >
          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Product Name *
            </label>

            <input
              name="name"
              defaultValue={
                product.name
              }
              required
              className={
                inputClasses
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Slug (URL)
            </label>

            <input
              name="slug"
              defaultValue={
                product.slug ||
                ""
              }
              className={
                inputClasses
              }
            />

            <p
              className="
                text-[8px]
                text-neutral-400
                mt-1
              "
            >
              Auto-generated from
              name if left empty
            </p>
          </div>
        </div>

        {/* ==============================================================
            GENDER / AUDIENCE
        =============================================================== */}

        <div className="space-y-4">
          <div>
            <label
              className={
                labelClasses
              }
            >
              Gender / Audience *
            </label>

            <p
              className="
                text-[10px]
                text-neutral-400
              "
            >
              Controls which
              customer collection
              this product appears
              under.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-3
            "
          >
            {GENDER_OPTIONS.map(
              (option) => (
                <label
                  key={
                    option.value
                  }
                  className="
                    border
                    border-neutral-200

                    p-4

                    cursor-pointer

                    has-[:checked]:border-black
                    has-[:checked]:bg-neutral-50

                    hover:border-neutral-400

                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={
                        option.value
                      }
                      required
                      defaultChecked={
                        product.gender ===
                        option.value
                      }
                      className="
                        mt-0.5
                        w-4
                        h-4
                        accent-black
                      "
                    />

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.2em]
                        "
                      >
                        {
                          option.label
                        }
                      </p>

                      <p
                        className="
                          mt-2
                          text-[9px]
                          leading-relaxed
                          text-neutral-400
                        "
                      >
                        {
                          option.description
                        }
                      </p>
                    </div>
                  </div>
                </label>
              ),
            )}
          </div>
        </div>

        {/* ==============================================================
            CATEGORIES + PRICE
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-8
          "
        >
          {/* CATEGORIES */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Categories * (select
              one or more)
            </label>

            <div
              className="
                grid
                grid-cols-2
                gap-2

                border
                border-neutral-200

                p-4
              "
            >
              {CATEGORY_OPTIONS.map(
                (category) => (
                  <label
                    key={
                      category
                    }
                    className="
                      flex
                      items-center
                      gap-2

                      text-xs
                      font-bold

                      cursor-pointer
                    "
                  >
                    <input
                      type="checkbox"
                      name="categories"
                      value={
                        category
                      }
                      defaultChecked={
                        product.categories?.includes(
                          category,
                        )
                      }
                      className="
                        w-4
                        h-4
                        accent-black
                      "
                    />

                    {category}
                  </label>
                ),
              )}
            </div>
          </div>

          {/* PRICE */}

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Price *
            </label>

            <input
              name="price"
              defaultValue={
                product.price ||
                ""
              }
              required
              className={
                inputClasses
              }
            />
          </div>
        </div>

        {/* ==============================================================
            STOCK + STATUS
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          "
        >
          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Stock Quantity
            </label>

            <input
              name="stock"
              type="number"
              defaultValue={
                product.stock ??
                0
              }
              min="0"
              className={
                inputClasses
              }
            />
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              pt-6
            "
          >
            <input
              type="checkbox"
              name="isNew"
              id="isNew"
              defaultChecked={
                product.isNew
              }
              className="
                w-4
                h-4
                accent-black
              "
            />

            <label
              htmlFor="isNew"
              className="
                text-[9px]
                font-black
                text-neutral-400
                uppercase
                tracking-[0.2em]
              "
            >
              New Arrival
            </label>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              pt-6
            "
          >
            <input
              type="checkbox"
              name="disabled"
              id="disabled"
              defaultChecked={
                product.disabled
              }
              className="
                w-4
                h-4
                accent-red-600
              "
            />

            <label
              htmlFor="disabled"
              className="
                text-[9px]
                font-black
                text-neutral-400
                uppercase
                tracking-[0.2em]
              "
            >
              Disable Product
            </label>
          </div>
        </div>

        {/* ==============================================================
            DESCRIPTION
        =============================================================== */}

        <div className="space-y-2">
          <label
            className={
              labelClasses
            }
          >
            Description (one
            paragraph per line)
          </label>

          <textarea
            name="description"
            rows={4}
            defaultValue={
              descriptionText
            }
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* ==============================================================
            DETAILS
        =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
          "
        >
          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Material
            </label>

            <input
              name="material"
              defaultValue={
                product.details
                  ?.material ||
                ""
              }
              className={
                inputClasses
              }
              placeholder="e.g., 100% Cotton"
            />
          </div>

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Care Instructions
            </label>

            <input
              name="care"
              defaultValue={
                product.details
                  ?.care ||
                ""
              }
              className={
                inputClasses
              }
              placeholder="e.g., Machine wash cold"
            />
          </div>

          <div className="space-y-2">
            <label
              className={
                labelClasses
              }
            >
              Origin
            </label>

            <input
              name="origin"
              defaultValue={
                product.details
                  ?.origin ||
                ""
              }
              className={
                inputClasses
              }
              placeholder="e.g., Kenya"
            />
          </div>
        </div>

        {/* ==============================================================
            COLORS
        =============================================================== */}

        <div className="space-y-4">
          <label
            className={
              labelClasses
            }
          >
            Colors (up to 4)
          </label>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >
            {[0, 1, 2, 3].map(
              (index) => {
                const color =
                  product.colors?.[
                    index
                  ];

                return (
                  <ColorPickerField
                    key={
                      index
                    }
                    index={
                      index
                    }
                    defaultLabel={
                      color?.label ||
                      ""
                    }
                    defaultHex={
                      color?.hex ||
                      "#000000"
                    }
                  />
                );
              },
            )}
          </div>
        </div>

        {/* ==============================================================
            SIZES
        =============================================================== */}

        <div className="space-y-2">
          <label
            className={
              labelClasses
            }
          >
            Sizes (comma separated)
          </label>

          <input
            name="sizes"
            defaultValue={
              sizesText
            }
            className={
              inputClasses
            }
            placeholder="XS, S, M, L, XL, XXL"
          />
        </div>

        {/* ==============================================================
            HERO IMAGE
        =============================================================== */}

        <div className="space-y-4">
          <label
            className={
              labelClasses
            }
          >
            Replace Hero Image
          </label>

          <p
            className="
              text-[9px]
              text-neutral-400
            "
          >
            Leave empty to keep the
            current hero image.
          </p>

          <input
            name="heroImage"
            type="file"
            accept="image/*"
            className="
              w-full

              text-sm
              text-neutral-500

              file:mr-4
              file:py-3
              file:px-6

              file:border
              file:border-black

              file:text-[10px]
              file:font-black

              file:bg-white
              file:text-black

              hover:file:bg-black
              hover:file:text-white
            "
          />
        </div>

        {/* ==============================================================
            THUMBNAILS
        =============================================================== */}

        <div className="space-y-4">
          <label
            className={
              labelClasses
            }
          >
            Replace Thumbnails
          </label>

          <p
            className="
              text-[9px]
              text-neutral-400
            "
          >
            Uploading thumbnails here
            replaces the existing
            thumbnail set. Leave all
            fields empty to keep the
            existing thumbnails.
          </p>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >
            {[1, 2, 3, 4].map(
              (number) => (
                <input
                  key={
                    number
                  }
                  name={`thumb${number}`}
                  type="file"
                  accept="image/*"
                  className="
                    text-sm
                    text-neutral-500

                    file:mr-4
                    file:py-2
                    file:px-4

                    file:border
                    file:border-neutral-200

                    file:text-[9px]
                    file:font-black

                    file:bg-white
                    file:text-neutral-600

                    hover:file:bg-black
                    hover:file:text-white
                  "
                />
              ),
            )}
          </div>
        </div>

        {/* ==============================================================
            SUBMIT
        =============================================================== */}

        <div
          className="
            pt-6
            border-t
            border-neutral-100
          "
        >
          <button
            type="submit"
            className="
              w-full

              bg-black
              text-white

              font-black

              py-6

              uppercase
              tracking-[0.3em]
              text-xs

              hover:bg-[#006241]

              transition-all
            "
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
