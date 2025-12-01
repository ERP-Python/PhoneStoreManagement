from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.exceptions import NotFound


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
        page_size = self.get_page_size(request)
        if not page_size:
            return None

        paginator = self.django_paginator_class(queryset, page_size)
        page_number = request.query_params.get(self.page_query_param, 1)
        
        try:
            page_number = int(page_number)
        except (TypeError, ValueError):
            page_number = 1
        
        # Ensure page number is at least 1
        if page_number < 1:
            page_number = 1
        
        # If page number exceeds total pages, return the last page
        if page_number > paginator.num_pages and paginator.num_pages > 0:
            page_number = paginator.num_pages
        
        try:
            self.page = paginator.page(page_number)
        except Exception as e:
            # If any error occurs, return first page
            self.page = paginator.page(1)
        
        self.request = request
        return list(self.page)
