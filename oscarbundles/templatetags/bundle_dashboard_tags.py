from django import template

register = template.Library()


@register.inclusion_tag('oscarbundles/dashboard/_product_list.html')
def grouped_product_list(products):
    groups = {}
    orphans = []
    for product in products.all():
        if not product.parent:
            orphans.append(product)
        else:
            group_name = product.parent.title
            if group_name not in groups:
                groups[group_name] = []
            groups[group_name].append(product)

    def sp(products):
        return sorted(products, key=lambda p: p.title)

    def sg(groups):
        return sorted(groups, key=lambda g: g['parent'].title)

    def group(name, products):
        products = sp(products)
        return {
            'parent': products[0].parent,
            'products': products,
        }

    return {
        'groups': sg(group(name, products) for name, products in groups.items()),
        'orphans': sp(orphans),
    }
