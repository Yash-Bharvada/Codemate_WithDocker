
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) 
    left = arr[:mid]
    right = arr[mid:]
    left = merge_sort(left)
    right = merge_sort(right)
    return merge(left, right)

def merge(left, right):
    result = []
    while len(left) > 0 and len(right) > 0:
        if left[0] <= right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    result.extend(left)
    result.extend(right)
    return result

arr = [5, 2, 8, 3, 1, 4, 6]
arr = merge_sort(arr)
print(arr)  
