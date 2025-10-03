from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class with graceful error handling
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
    
    def paginate_queryset(self, queryset, request, view=None):
        """
        Override to handle invalid page gracefully
        """
        try:
            return super().paginate_queryset(queryset, request, view)
        except:
            # If page is invalid, return first page
            self.request = request
            page_size = self.get_page_size(request)
            if not page_size:
                return None
            
            paginator = self.django_paginator_class(queryset, page_size)
            # Force to first page if invalid
            page_number = 1
            self.page = paginator.page(page_number)
            self.request = request
            return list(self.page)
